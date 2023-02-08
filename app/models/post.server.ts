import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import http from "http";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const isDev = process.env.NODE_ENV === "development";

const fileRoot = isDev ? "public" : "data";

export async function getPosts(sort: string = "new") {
  const sortKey: any = {
    new: { createdAt: "desc" },
    popular: {
      views: {
        _count: "desc",
      },
    },
    trending: {
      views: {
        _count: "desc",
      },
    },
  };
  const sortIsValid = Object.keys(sortKey).includes(sort);
  return prisma.post.findMany({
    orderBy: [sortIsValid ? sortKey[sort] : sortKey.new],
    include: {
      _count: {
        select: {
          views: true,
        },
      },
    },
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          views: true,
        },
      },
    },
  });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown" | "dropHead">
) {
  return prisma.post.create({ data: post });
}

export async function generatePosts(
  categories: string[] = ["tech"],
  amount: number = 12
) {
  const category = categories[Math.floor(Math.random() * categories.length)];

  const responseData = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give ${amount} ideas for a blog posts, each for a specific subject in the category of ${category}.
      Output in valid JSON format as shown in the example below.
      [
        {
          "title": "The blog post title",
          "dropHead": "Fifteen to twenty words describing the post",
          "imageDescription": "a description of an image that would go with the post"
        }
      ]
      `,
    max_tokens: 1000,
    temperature: 0.5,
  });

  const completion = responseData.data;
  console.log(completion);
  console.log(completion.choices[0].text);

  let posts = [];

  if (completion.choices[0].text) {
    const json = JSON.parse(completion.choices[0].text.trim());

    for (const post of json) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const postObject = {
        slug,
        title: post.title,
        dropHead: post.dropHead,
        imageDescription: post.imageDescription,
        category,
      };

      posts.push(
        await prisma.post.upsert({
          where: { slug },
          update: postObject,
          create: postObject,
        })
      );
    }
  }

  return posts;
}

export async function generatePostBody(slug: string) {
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
    return null;
  }

  const responseData = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Write a ~500 word blog post in valid markdown about ${post.title} ${post.dropHead}`,
    max_tokens: 1000,
    temperature: 0.5,
  });

  const completion = responseData.data;
  console.log(completion);
  console.log(completion.choices[0].text);

  if (completion.choices[0].text) {
    const markdown = completion.choices[0].text;

    return prisma.post.update({
      where: { slug },
      data: { markdown },
    });
  }

  return null;
}

export async function generatePostImage(slug: string, prompt = "") {
  // get the post from the db
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return null;
  const fallbackPrompt = `Style: Knolling still-life photograph of everyday objects; Colors: vibrant, pastel, FF6666; Theme: ${post.title} ${post.dropHead}`;
  // call image generation api
  const { data: response } = await openai.createImage({
    prompt: `${
      prompt || post.imageDescription || fallbackPrompt
    } - in the style of 3D art, colorful background`,
    n: 1,
    size: "1024x1024",
  });
  if (!response.data?.length) return null;

  // save the image to the public images folder
  const imageUrl = response.data[0].url;
  // download image from url
  if (imageUrl) {
    const url = await uploadImage(imageUrl, slug);
    // set post image to the image url
    return prisma.post.update({
      where: { slug },
      data: { image: url },
    });
  }
}

export async function deletePosts() {
  return prisma.post.deleteMany();
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}

export async function updatePost(
  slug: string,
  post: Pick<Post, "title" | "markdown" | "dropHead" | "slug">
) {
  return prisma.post.update({
    where: { slug },
    data: post,
  });
}

export async function setFeaturedPost(slug: string) {
  await prisma.post.updateMany({
    where: { featured: true },
    data: { featured: false },
  });
  return prisma.post.update({
    where: { slug },
    data: { featured: true },
  });
}

const uploadImage = async (imagePath: string, filename: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    public_id: `turinger/${filename}`,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

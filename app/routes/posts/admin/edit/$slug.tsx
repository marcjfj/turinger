import invariant from "tiny-invariant";
import {
  generatePostBody,
  generatePostImage,
  getPost,
  setFeaturedPost,
  updatePost,
} from "~/models/post.server";
import type { LoaderArgs, ActionArgs, Request } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { useNavigation } from "@remix-run/react";
import { requireAdmin } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  await requireAdmin(request, "/");

  invariant(params.slug, `params.slug is required`);
  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);
  return json({ post });
};

const handlePostUpdate = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const dropHead = formData.get("dropHead") as string;
  const slug = formData.get("slug") as string;
  const markdown = formData.get("markdown") as string;

  invariant(title, `title is required`);
  invariant(slug, `slug is required`);

  // update post
  return updatePost(slug, { title, slug, dropHead, markdown });
};

export const action = async ({ request }: ActionArgs) => {
  await requireAdmin(request, "/");
  // get formDate
  const formData = await request.formData();
  if (formData.get("action") === "generate-body") {
    console.log("generate body");
    return generatePostBody(formData.get("slug") as string);
  } else if (formData.get("action") === "generate-image") {
    console.log("generate image");
    return generatePostImage(formData.get("slug") as string);
  } else if (formData.get("action") === "set-featured") {
    console.log("set featured");
    return setFeaturedPost(formData.get("slug") as string);
  }
  // get title, slug, body from request body
  return handlePostUpdate(formData);
};

export default function editPage() {
  const { post } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <div className="col-span-3 mx-auto w-full max-w-[800px] py-6">
      <div className="image-gen mb-6">
        {!post.featured && (
          <Form className="flex items-center justify-center p-6" method="post">
            <input type="hidden" name="action" value="set-featured" />
            <input type="hidden" name="slug" value={post.slug} />
            <button
              name="set-featured"
              className="bg-green-500 p-2 px-6 text-white"
              type="submit"
            >
              Set as Featured Post
            </button>
          </Form>
        )}

        <Form
          method="post"
          className="flex w-full items-center justify-center border border-slate-200 p-4"
          id="generate-image"
        >
          {post.image && (
            <div className="img flex w-1/2 justify-start">
              <img
                src={post.image}
                alt=""
                className="image-preview h-48 w-full object-cover"
              />
            </div>
          )}
          <input type="hidden" name="action" value="generate-image" />
          <input type="hidden" name="slug" value={post.slug} />
          {navigation.state !== "loading" &&
          navigation.state !== "submitting" ? (
            <button
              type="submit"
              className="mx-auto my-6 border border-blue-500 bg-white p-4 px-6 text-blue-500"
            >
              Generate Image
            </button>
          ) : (
            // Spinner
            <div className="mx-auto my-6 border border-blue-500 bg-white p-4 px-6">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          )}
        </Form>
      </div>
      <Form
        method="post"
        className="flex flex-col"
        id="edit-form"
        key={post.slug}
      >
        <label htmlFor="post-title" className="mb-2 text-lg font-bold">
          Title
        </label>
        <input
          id="post-title"
          type="text"
          name="title"
          defaultValue={post.title}
          className="mb-6 block border border-slate-300 p-2"
        />
        <label htmlFor="post-slug" className="mb-2 text-lg font-bold">
          Slug
        </label>
        <input
          id="post-slug"
          type="text"
          name="slug"
          defaultValue={post.slug}
          className="mb-6 block border border-slate-300 p-2"
        />

        <label htmlFor="post-drophead" className="mb-2 text-lg font-bold">
          Drop Head
        </label>
        <input
          id="post-drophead"
          type="text"
          name="dropHead"
          defaultValue={post.dropHead}
          className="mb-6 block border border-slate-300 p-2"
        />
        <label
          htmlFor="post-image-description"
          className="mb-2 text-lg font-bold"
        >
          Image Description
        </label>
        <input
          id="post-image-description"
          type="text"
          name="imageDescription"
          defaultValue={post.imageDescription || ""}
          className="mb-6 block border border-slate-300 p-2"
        />
        <label htmlFor="post-markdown" className="mb-2 text-lg font-bold">
          Post Body
        </label>
        {post.markdown ? (
          <textarea
            id="post-markdown"
            name="markdown"
            className="mb-6 block h-96 border border-slate-300 p-2"
            defaultValue={post.markdown}
          ></textarea>
        ) : null}
      </Form>
      {!post.markdown && (
        <Form
          method="post"
          className="flex w-full flex-col items-center border border-slate-200 p-16"
          key={`post-body-${post.slug}`}
        >
          <input type="hidden" name="action" value="generate-body" />
          <input type="hidden" name="slug" value={post.slug} />
          <button
            type="submit"
            name="generate-body"
            value="generate"
            className={`mx-auto border border-blue-500 bg-white p-4 px-6 ${
              navigation.state === "loading"
                ? "bg-blue-500 text-white"
                : "text-blue-500"
            }`}
            disabled={navigation.state === "loading"}
          >
            Generate Post Body
          </button>
        </Form>
      )}
      <div className="edit-form-footer">
        <button
          type="submit"
          name="update"
          form="edit-form"
          value="edit"
          className={`mr-auto mt-10 bg-green-200 p-2 px-6 text-green-900
          ${navigation.state === "loading" ? "bg-gray-500 text-white" : ""}}`}
          disabled={navigation.state === "loading"}
        >
          Save
        </button>
      </div>
    </div>
  );
}

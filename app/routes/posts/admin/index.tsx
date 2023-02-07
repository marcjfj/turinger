import { json, LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { requireAdmin } from "~/session.server";
import {
  generatePostBody,
  getPosts,
  generatePostImage,
} from "~/models/post.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireAdmin(request, "/");
  return json({ posts: await getPosts() });
};

export const action = async ({ request }: ActionArgs) => {
  await requireAdmin(request, "/");
  const formData = new URLSearchParams(await request.text());
  const slug = formData.get("slug");
  if (!slug) {
    console.log("no slug");
    return;
  }
  console.log(slug);
  const action = formData.get("action");
  let updatedPost;
  if (action === "generate-body") {
    updatedPost = await generatePostBody(slug);
  } else if (action === "generate-image") {
    updatedPost = await generatePostImage(slug);
  }
  return json({ updatedPost }, { status: 200 });
};

export default function DashboardOverview() {
  const { posts } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  return (
    <>
      <div className="post-count col-span-1 my-6 flex flex-col items-start justify-center border border-slate-100 bg-white p-8">
        <h1 className="text-2xl font-bold">Posts</h1>
        <p className="text-sm text-gray-500">
          Total Headlines: {posts.filter((p) => p.title).length}
        </p>
        <p className="text-sm text-gray-500">
          Post Bodies: {posts.filter((p) => p.markdown).length}
        </p>
        <p className="text-sm text-gray-500">
          Post Images: {posts.filter((p) => p.image).length}
        </p>
      </div>
    </>
  );
}

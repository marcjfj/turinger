import { LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { useOptionalUser } from "~/utils";

import { getPost } from "~/models/post.server";
import { logView } from "~/models/view.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);
  logView(params.slug, request);

  const post = await getPost(params.slug);
  if (!post) {
    return redirect("/posts");
  }

  const html = post.markdown ? marked(post.markdown) : "";
  return json({ post, html });
};

export default function Post() {
  const { post, html } = useLoaderData<typeof loader>();
  const user = useOptionalUser();
  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-3xl p-6">
        <h1 className="my-6 mb-2 text-center text-3xl font-extrabold">
          {post.title}
        </h1>
        <p className="views mx-auto mb-12 p-2 text-center text-sm text-dark-blue">
          <span className="">Views </span>
          <span>{post._count.views}</span>
        </p>
        {user?.role === "ADMIN" && (
          <div className="admin text-center">
            <Link
              to={`/posts/admin/edit/${post.slug}`}
              className="mx-auto mb-12 inline-block bg-dark-blue p-2 text-sm text-white"
            >
              Edit
            </Link>
          </div>
        )}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="mb-8 aspect-[9/6] w-full object-cover"
          />
        )}
        <div
          className="text-dark-blue [&>p]:mb-8 [&>h1]:hidden [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-very-dark-blue"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
    </>
  );
}

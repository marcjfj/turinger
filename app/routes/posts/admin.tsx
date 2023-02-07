import { ActionArgs, json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";

import { generatePosts, getPosts } from "~/models/post.server";
import { requireAdmin } from "~/session.server";
import { useUser } from "~/utils";
import Logo from "~/components/logo";

export const loader = async ({ request }: LoaderArgs) => {
  const _admin = await requireAdmin(request, "/");
  return json({ posts: await getPosts() });
};

export const action = async ({ request }: ActionArgs) => {
  const _admin = await requireAdmin(request, "/");
  return generatePosts();
};

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();
  const user = useUser();
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-slate-50">
      <header className="admin-header sticky top-0 flex h-[50px] items-center justify-between border-b border-slate-200 bg-white px-6">
        <Link
          to="/posts/admin"
          className="logo group flex items-center gap-4  transition-colors hover:text-soft-red"
        >
          <Logo className="transi h-8 w-8" />
          <h1 className="text-2xl font-bold">Admin</h1>
        </Link>
        {/* <nav className="links">
          <ul>
            <li>
              <Link to="/posts/admin">Dashboard</Link>
            </li>
          </ul>
        </nav> */}
        <div className="user">
          <span className="flex items-center rounded-full bg-slate-100 p-1 pl-4 text-sm">
            <span>{user.email}</span>
            <Form method="post" action="/api/logout">
              <button className="0 ml-4 rounded-full bg-very-dark-blue p-1 px-4 text-xs text-white">
                Logout
              </button>
            </Form>
          </span>
        </div>
      </header>
      <div className="grid min-h-screen grid-cols-4 gap-6">
        <nav className="sticky top-[50px] col-span-4 h-[calc(100vh-50px)] max-h-screen overflow-y-auto border-r border-slate-100 bg-slate-50 p-6 md:col-span-1">
          <Form method="post">
            <button
              name="new"
              type="submit"
              className="mb-6 flex w-full items-center justify-center border border-green-500 bg-green-200 py-4 text-center text-xs text-green-800"
            >
              <span className="block text-center">New Post</span>
            </button>
          </Form>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`edit/${post.slug}`}
                  className="mb-6 flex border-b border-slate-200 py-4 text-xs text-blue-900"
                >
                  <span className="mr-auto block">{post.title}</span>
                  {post.markdown && (
                    <span className="ml-2 mb-auto rounded-full bg-green-700 p-1 px-2 text-xs uppercase text-white">
                      Body
                    </span>
                  )}
                  {post.image && (
                    <span className="ml-2 mb-auto rounded-full bg-purple-700 p-1 px-2 text-xs uppercase text-white">
                      IMG
                    </span>
                  )}
                  {post.featured && (
                    <span className="ml-2 mb-auto rounded-full bg-yellow-400 p-1 px-2 text-xs uppercase text-yellow-800">
                      F
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 grid min-h-[100vh-50px] grid-cols-3 grid-rows-2 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

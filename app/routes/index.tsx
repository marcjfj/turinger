import { redirect } from "@remix-run/server-runtime";
import FeaturedPost from "~/components/FeaturedPost";
import Header from "~/components/Header";
import PostList from "~/components/PostListSmall";
import SmallPost from "~/components/SmallPost";
import { Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { deletePosts, getPosts } from "~/models/post.server";
import { useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";

import { formatPosts } from "~/utils";
import Footer from "~/components/Footer";

export async function loader() {
  return json({
    posts: await getPosts(),
  });
}

export const action = async ({ request }: ActionArgs) => {};

export default function Index() {
  const posts = formatPosts(useLoaderData<typeof loader>().posts);
  const featuredPost = posts.find((p) => p.featured);
  // remove featured post from posts
  posts.splice(posts.indexOf(featuredPost), 1);
  const newPosts = posts.slice(0, 3);
  const popularPosts = posts.slice(4, 7);
  return (
    <div className="mx-auto min-h-screen w-full">
      <Header />
      {posts.length ? (
        <main className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-6 px-6 pb-16 lg:px-0">
          {/* FEATURED */}
          <div className="featured-slot col-span-3 md:col-span-2">
            <FeaturedPost post={featuredPost} />
          </div>
          {/* NEW */}
          <div className="new-slot justify-stretch col-span-3 row-span-1 flex flex-col md:col-span-1">
            <PostList posts={newPosts} />
          </div>
          {/* POPULAR */}
          <ul className="popular-slot col-span-3 mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:p-0">
            {popularPosts.map((post, i) => (
              <SmallPost key={post.slug} count={i + 1} post={post} />
            ))}
          </ul>
        </main>
      ) : null}
      <Footer />
    </div>
  );
}

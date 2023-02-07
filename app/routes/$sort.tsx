import { json, LoaderArgs } from "@remix-run/node";
import { getPosts } from "~/models/post.server";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import PostListings from "~/components/PostListings";
import { formatPosts } from "~/utils";
import Footer from "~/components/Footer";

export async function loader({ params }: LoaderArgs) {
  const { sort } = params;
  const titles: any = {
    new: "New Posts",
    popular: "Popular Posts",
    trending: "Trending Posts",
  };
  return json({
    posts: await getPosts(sort),
    title: typeof sort === "string" ? titles[sort] : titles.new,
  });
}
export default function NewPosts() {
  const loaderData = useLoaderData<typeof loader>();
  const posts = formatPosts(loaderData.posts);
  const { title } = loaderData;
  return (
    <>
      <Header />
      {posts.length === 0 ? (
        <p className="no-posts">There are no posts yet :(</p>
      ) : (
        <PostListings posts={posts} title={title} />
      )}
      <Footer />
    </>
  );
}

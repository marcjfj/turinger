import { Link } from "@remix-run/react";
import type { Post } from "@prisma/client";

interface PostWithViewCount extends Post {
  _count: {
    views: number;
  };
}

export default function PostListings({
  title,
  posts,
}: {
  title: string;
  posts: PostWithViewCount[];
}) {
  return (
    <div className="post-list mx-auto w-full max-w-5xl py-8 px-6 lg:px-0">
      <h2 className="mb-12 text-3xl font-bold text-soft-red">{title}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="my-4 block">
            <Link
              to={`/posts/${post.slug}`}
              className="group flex items-center"
            >
              <img
                src={post.image || ""}
                alt=""
                className="post-image h-full max-h-32 w-1/3 object-cover"
              />
              <div className="post-info w-2/3 p-6">
                <h2 className="title mb-2 text-lg font-bold text-very-dark-blue group-hover:text-soft-orange">
                  {post.title}
                </h2>
                <p className="text-sm text-dark-blue line-clamp-2">
                  {post.dropHead}
                </p>
                <p className="views mt-2 text-xs text-dark-blue">
                  <span>Views:</span> <span>{post._count.views}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

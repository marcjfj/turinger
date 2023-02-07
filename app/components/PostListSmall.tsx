import { Link } from "@remix-run/react";
import type { Post } from "@prisma/client";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list h-full bg-very-dark-blue p-6 py-8">
      <h2 className="text-3xl font-bold text-soft-orange">New</h2>
      <ul>
        {posts.map((post) => (
          <li
            key={post.slug}
            className="block w-full border-b border-dark-blue py-6 last:border-b-0 last:pb-0"
          >
            <Link to={`posts/${post.slug}`} className="group">
              <h2 className="title mb-2 text-lg font-bold text-white group-hover:text-soft-orange">
                {post.title}
              </h2>
              <p className="text-sm text-gray-blue line-clamp-2">
                {post.dropHead}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

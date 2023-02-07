import { Link } from "@remix-run/react";
import type { Post } from "@prisma/client";

export default function SmallPost({
  count,
  post,
}: {
  count: number;
  post: Post;
}) {
  return (
    <li className="col-span-1 flex h-full flex-col">
      <Link
        to={`posts/${post.slug}`}
        className="group grid h-full grid-cols-3 gap-4"
      >
        <img
          src={post.image || `https://picsum.photos/30${count}/300`}
          alt=""
          className="col-span-1 h-full max-h-40 w-full object-cover"
        />
        <div className="popular-item-description col-span-2">
          <span className="count text-3xl font-bold text-gray-blue">{`0${count}`}</span>
          <h2 className="col-span-2 mb-2 font-bold group-hover:text-soft-red">
            {post.title}
          </h2>
          <p className="col-span-2 mb-auto text-sm text-dark-blue line-clamp-2">
            {post.dropHead}
          </p>
        </div>
      </Link>
    </li>
  );
}

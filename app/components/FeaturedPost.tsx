import { Link } from "@remix-run/react";
import type { Post } from "@prisma/client";
export default function FeaturedPost({ post }: { post: Post }) {
  if (!post) return null;
  return (
    <div className="featured grid h-full grid-cols-2 gap-6 p-0">
      <img
        src={post.image || "https://picsum.photos/1000/1000"}
        alt=""
        className="col-span-2 block aspect-[2/1] h-full w-full object-cover"
      />
      <h3 className="col-span-2 text-5xl font-extrabold md:col-span-1">
        {post.title}
      </h3>
      <div className="featured-cta col-span-2 flex flex-col gap-6 md:col-span-1">
        <p className="text-lg text-dark-blue">{post.dropHead}</p>
        <Link
          to={`posts/${post.slug}`}
          className=" mr-auto mt-auto bg-soft-red p-3 px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-very-dark-blue"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

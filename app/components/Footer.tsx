import { Link } from "react-router-dom";
import Logo from "~/components/logo";

export default function Footer() {
  return (
    <footer className="bg-very-dark-blue p-8 py-16">
      <div className="footer-content mx-auto grid w-full max-w-5xl grid-cols-2 gap-6">
        <div className="footer-left col-span-1">
          <div className="logo mb-4">
            <Logo className="h-12 w-12 text-gray-blue" />
          </div>
          <h2 className="text-3xl font-bold text-gray-blue">The Turinger</h2>
          <p className="mt-4 text-sm text-gray-blue">
            The Turinger is a blog about the intersection of technology and
            humanity. It is a place to explore the ideas and concepts that shape
            our world.
          </p>
        </div>
        <div className="footer-right col-span-1">
          <ul className="text-right">
            <li className="mb-4">
              <Link to="/" className="text-sm text-white hover:text-gray-blue">
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/posts/new"
                className="text-sm text-white hover:text-gray-blue"
              >
                New
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/posts/popular"
                className="text-sm text-white hover:text-gray-blue"
              >
                Popular
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/posts/trending"
                className="text-sm text-white hover:text-gray-blue"
              >
                Trending
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

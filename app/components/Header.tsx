import { Form, Link, useMatches } from "@remix-run/react";
import { useState } from "react";
import { useOptionalUser } from "~/utils";
import Logo from "./logo";

export default function Header() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "New", path: "/new" },
    { name: "Popular", path: "/popular" },
    { name: "Trending", path: "/trending" },
    { name: "Categories", path: "/categories" },
  ];
  const user = useOptionalUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const matches = useMatches();
  return (
    <header
      key={matches.length && matches[matches.length - 1]?.pathname}
      className="sticky top-0 mx-auto flex w-full max-w-5xl items-center justify-between bg-white p-6 md:relative md:py-10 lg:px-0"
    >
      <Link to="/" className="transition-colors hover:text-soft-red">
        <div className="logo">
          <Logo className="h-12 w-12" />
          <h1 className="sr-only text-4xl">The Turinger</h1>
        </div>
      </Link>
      <button
        className="absolute top-0 bottom-0 right-6 z-10 flex flex-col items-center justify-center md:hidden"
        onClick={() => setMenuOpen((m) => !m)}
      >
        <i
          className={`mb-[4px] h-[2px] w-8 bg-very-dark-blue transition-all ${
            menuOpen ? "translate-y-[6px] rotate-[45deg]" : ""
          }`}
        ></i>
        <i
          className={`h-[2px] w-8 bg-very-dark-blue transition-all ${
            menuOpen ? "opacity-0" : ""
          }`}
        ></i>
        <i
          className={`mt-[4px] h-[2px] w-8 bg-very-dark-blue transition-all ${
            menuOpen ? "translate-y-[-6px] rotate-[-45deg]" : ""
          }`}
        ></i>
      </button>
      <nav
        className={`fixed inset-0 bg-black bg-opacity-50 transition-all md:relative md:bg-white ${
          !menuOpen
            ? "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100"
            : ""
        }`}
      >
        <ul className="absolute inset-0 left-16 flex flex-col justify-center gap-9 bg-white p-10 text-dark-blue md:relative md:left-auto md:flex md:flex-row md:p-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                className="text-2xl font-bold hover:text-soft-red md:text-sm md:font-normal"
                to={item.path}
              >
                {item.name}
              </Link>
            </li>
          ))}
          {user?.role === "ADMIN" && ( // If user is logged in, show the admin link
            <li>
              <Link
                className="bg-soft-red p-2 px-4 text-sm text-white hover:bg-very-dark-blue"
                to="/posts/admin"
              >
                Admin
              </Link>
            </li>
          )}
          {!user && (
            <li>
              <Link
                className="bg-soft-red p-2 px-4 text-sm text-white hover:bg-very-dark-blue"
                to="/login"
              >
                Login
              </Link>
            </li>
          )}
          {user?.role === "USER" && (
            <li>
              <Form method="post" action="/api/logout">
                <button className="bg-soft-red p-2 px-4 text-sm text-white hover:bg-very-dark-blue">
                  Logout
                </button>
              </Form>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

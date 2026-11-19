import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";
import Logo from "./Logo";

const LINKS = [
  { to: "/", label: "Discover", end: true },
  { to: "/matches", label: "Matches" },
  { to: "/saved", label: " Saved" },
  { to: "/skills", label: "Add your skills" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // Re-render on every route change so the login status stays current.
  useLocation();
  const user = getCurrentUser();

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-purple-100 text-purple-700"
        : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
    }`;

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-purple-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button type="button" onClick={() => navigate("/")} aria-label="SkillSwap home">
          <Logo />
        </button>

        <button
          type="button"
          className="rounded-md p-2 text-gray-700 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <div
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center md:gap-1`}
        >
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-200 md:ml-2"
            >
              {user.name.split(" ")[0]} · Log out
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full bg-purple-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-purple-700 md:ml-2"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
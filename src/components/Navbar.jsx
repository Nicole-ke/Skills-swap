import { useState } from "react";
import { NavLink,useLocation,useNavigate,useSearchParams } from "react-router-dom";
import SearchBar from "./searchBar";
import Logo from "./Logo";

const LINKS = [
  
{ to: "/discover", label: "Discover" },
  { to: "/", label: "Matches", end: true },
  { to: "/search", label: "Search" },
  { to: "/saved", label: "♥ Saved" },
  { to: "/skills", label: "Add your skills" },
  { to: "/login", label: "Login" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {pathname} = useLocation();

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-purple-100 text-purple-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
    }`;

    function handleSearch(event) {
        //stays on discover if we are there .otherwise go to search
        const target = pathname === "/discover" ? "/discover" : "/search";//decides which page to send to pathname(?)if else
           // What the user typed, made safe for a URL
    const text = encodeURIComponent(event.target.value);
    // Go to e.g. /search?q=guitar
    navigate(`${page}?q=${text}`);
  }
                      //page shown above,query string,      
    }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          type="button"
          className="text-lg font-semibold text-purple-700"
          onClick={() => navigate("/")}
        >
          Skills Swap
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

        <div className={`${open ? "block" : "hidden"} space-y-2 md:flex md:space-y-0 md:items-center md:gap-2`}>
          {LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="ml-4">
          <SearchBar params={params} />
        </div>
      </div>
    </nav>
  );
}

import { useEffect, useState } from "react";
import SearchBar from "./components/searchBar";
import FilterChips from "./components/FilterChips";


import { BASE_URL } from "./utils/utils";
const CATEGORIES = ["All", "Design", "Coding", "Music", "Languages"];

const CATEGORY_KEYWORDS = {
  Design: ["design", "figma", "photography"],
  Coding: ["python", "react", "excel", "data"],
  Music: ["guitar", "music"],
  Languages: ["swahili", "speaking"],
};

function App() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All"); //stores the current filter chip

  useEffect(() => {
   fetch(`${BASE_URL}/users`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("users loaded:", data);
      setUsers(data);
    })
    .catch((err) => console.error("Fetch failed:", err));
  }, []);

  const results = users.filter((u) => {
    const text = [u.name, u.location, ...(u.offers ?? []), ...(u.wants ?? [])]
      .join(" ")
      .toLowerCase();

    const matchesQuery = text.includes(query.trim().toLowerCase());
    const keywords = CATEGORY_KEYWORDS[category];
    const matchesCategory =
      category === "All" || (keywords ?? []).some((k) => text.includes(k));

    return matchesQuery && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-5 text-3xl font-bold text-slate-900">Skills Swap</h1>
        <SearchBar value={query} onChange={setQuery} />

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-sm font-medium text-indigo-700"
            >
              {item}
            </button>
          ))}
        </div>

        {query.trim().length > 0 && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="mb-3 px-1 text-sm font-medium text-slate-500">
              {results.length} {results.length === 1 ? "person" : "people"} found
            </div>

            <ul className="space-y-3">
              {results.map((u) => (
                <li
                  key={u.id}
                  className="cursor-pointer rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-amber-50 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <span className="text-sm font-medium text-indigo-700">
                      {(u.offers ?? []).join(", ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{u.location}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;

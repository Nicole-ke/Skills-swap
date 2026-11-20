import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function DiscoverSearch({ skills = [] }) {
  const [term, setTerm] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [blockedReason, setBlockedReason] = useState(null);
  const navigate = useNavigate();

  function search(skill) {
    const query = skill.trim();
    if (!query) return;
    setLastSearch(query);

    const user = getCurrentUser();
    if (!user) {
      setBlockedReason("login");
      return;
    }
    // Swaps go both ways, so users must offer something before they can search.
    if (!user.offers || user.offers.length === 0) {
      setBlockedReason("no-skill");
      return;
    }

    navigate(`/matches?skill=${encodeURIComponent(query)}`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    search(term);
  }

  function handleChipClick(skill) {
    setTerm(skill);
    search(skill);
  }

  return (
    <section className="mb-10">
      <div className="rounded-3xl bg-linear-to-r from-pink-100 via-purple-100 to-sky-100 p-6 shadow-sm md:p-10">
        <h2 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
          What do you want to learn today?
        </h2>
        <p className="mt-1 text-gray-600">
          Search by skill, name or location and we'll show you who matches.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search skills, names, locations or descriptions..."
            aria-label="Search skills, names, locations or descriptions"
            className="flex-1 rounded-full bg-white/90 px-5 py-3 text-gray-800 outline-none ring-2 ring-transparent transition focus:ring-purple-300"
          />
          <button
            type="submit"
            className="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-95"
          >
            Find matches
          </button>
        </form>

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Popular:</span>
            {skills.slice(0, 8).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleChipClick(skill)}
                className="rounded-full bg-white/70 px-3 py-1 text-sm text-gray-700 transition hover:bg-white hover:text-purple-700"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {blockedReason && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
          onClick={() => setBlockedReason(null)}
        >
          <div
            className="animate-rise w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {blockedReason === "login" ? (
              <>
                <h3 className="text-xl font-bold text-gray-900">Join SkillSwap first</h3>
                <p className="mt-2 text-gray-600">
                  Log in or create an account to see who can teach you "{lastSearch}".
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-6 w-full rounded-full bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
                >
                  Log in / Sign up
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900">What can you offer?</h3>
                <p className="mt-2 text-gray-600">
                  Add at least one skill you can teach, then we'll find your matches.
                </p>
                <button
                  onClick={() => navigate("/skills")}
                  className="mt-6 w-full rounded-full bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600"
                >
                  Add a skill
                </button>
              </>
            )}
            <button
              onClick={() => setBlockedReason(null)}
              className="mt-3 text-sm text-gray-500 hover:underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
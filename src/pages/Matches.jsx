import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import LoginPrompt from "../components/LoginPrompt";
import useUsers from "../hooks/useUsers";
import { getCurrentUser } from "../utils/auth";
import { getSavedIds, storeSavedIds } from "../utils/saved";

function skillMatches(skill, query) {
  return skill.toLowerCase().includes(query.toLowerCase());
}

function searchableText(user) {
  return [user.name, user.bio, user.location, ...(user.offers || []), ...(user.wants || [])]
    .join(" ")
    .toLowerCase();
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function scoreMatch(user, myOffers, myWants) {
  const theyOffer = user.offers || [];
  const theyWant = user.wants || [];

  const skillsTheyCanTeach = myWants.filter((want) =>
    theyOffer.some((offer) => skillMatches(offer, want))
  );
  const skillsYouCanTeach = theyWant.filter((want) =>
    myOffers.some((offer) => skillMatches(offer, want))
  );

  const total = myWants.length + theyWant.length;
  const matchPercentage = total
    ? Math.round(((skillsTheyCanTeach.length + skillsYouCanTeach.length) / total) * 100)
    : 0;

  return {
    ...user,
    skillsTheyCanTeach,
    skillsYouCanTeach,
    matchedSkills: [...skillsTheyCanTeach, ...skillsYouCanTeach],
    matchPercentage,
  };
}

function Matches() {
  const currentUser = getCurrentUser();
    const [searchParams] = useSearchParams();
  const skill = searchParams.get("skill") || "";

  const { users, loading, error } = useUsers();
  const [savedIds, setSavedIds] = useState(() =>
    currentUser ? getSavedIds(currentUser.id) : []
  );

  function toggleSave(id) {
    const idString = String(id);
    setSavedIds((currentIds) => {
      const updatedIds = currentIds.includes(idString)
        ? currentIds.filter((savedId) => savedId !== idString)
        : [...currentIds, idString];
      storeSavedIds(currentUser.id, updatedIds);
      return updatedIds;
    });
  }

  if (!currentUser) return <LoginPrompt title="Log in to see your matches" />;
  if (loading) return <p className="p-10 text-center text-gray-500">Finding your matches...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

    if (!skill) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="animate-rise rounded-3xl bg-linear-to-r from-purple-100 via-pink-100 to-amber-100 p-10 text-center">
          <div className="text-5xl"></div>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">
            Your swap matches will be found here
          </h1>
          <p className="mt-2 text-gray-600">
            Search for a skill on Discover and the people who match you will show up on this page.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Search on Discover
          </Link>
        </div>
      </div>
    );
  }

  // Prefer the database copy of the user in case their skills changed since login.
  const me = users.find((user) => String(user.id) === String(currentUser.id)) || currentUser;
  const myOffers = me.offers || [];
  const myWants = [...(me.wants || [])];
  // Only count the search term as a "want" if it's actually a skill someone teaches.
  const searchIsSkill = users.some((user) =>
    (user.offers || []).some((offer) => skillMatches(offer, skill))
  );
  if (skill && searchIsSkill && !myWants.some((want) => skillMatches(want, skill))) {
    myWants.push(skill);
  }

  const results = users
    .filter((user) => String(user.id) !== String(me.id))
    .filter((user) => !skill || searchableText(user).includes(skill.toLowerCase()))
    .map((user) => scoreMatch(user, myOffers, myWants))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="animate-rise rounded-3xl bg-linear-to-r from-purple-100 via-pink-100 to-amber-100 p-6 md:p-8">
        <p className="text-sm font-semibold text-purple-600">Hi {me.name.split(" ")[0]}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
          {skill ? (
            <>
              Results for <span className="text-purple-600">"{skill}"</span>
            </>
          ) : (
            "Your matches"
          )}
        </h1>
        <p className="mt-2 text-gray-600">
          {results.length} {results.length === 1 ? "person" : "people"} found, best matches first
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
          >
            New search
          </Link>
                   {skill && (
            <button
              onClick={() => setSearchParams({})}
              className="rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white"
            >
              Show everyone
            </button>
          )}

          <Link
            to="/saved"
            className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
          >
            Saved ({savedIds.length})
          </Link>
        </div>
      </header>

      {results.length === 0 ? (
        <div className="animate-rise mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            {skill ? `No one matches "${skill}" yet` : "No matches yet"}
          </h2>
          <Link
            to="/"
            className="mt-5 inline-block rounded-full bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            Try another skill
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((user, index) => (
            <div key={user.id} className="animate-rise" style={{ animationDelay: `${index * 80}ms` }}>
              <MatchCard
                id={user.id}
                name={user.name}
                location={user.location}
                initials={getInitials(user.name)}
                matchPercentage={user.matchPercentage}
                matchedSkills={user.matchedSkills}
                skillsTheyCanTeach={user.skillsTheyCanTeach}
                skillsYouCanTeach={user.skillsYouCanTeach}
                canTeach={user.offers || []}
                wantsToLearn={user.wants || []}
                duration={user.timeToLearn || "To be agreed"}
                amount="Skill swap"
                isSaved={savedIds.includes(String(user.id))}
                onToggleSave={toggleSave}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
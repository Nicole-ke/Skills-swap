import { useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import LoginPrompt from "../components/LoginPrompt";
import useUsers from "../hooks/useUsers";
import { getCurrentUser } from "../utils/auth";
import { getSavedIds, storeSavedIds } from "../utils/saved";

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function SavedMatches() {
  const currentUser = getCurrentUser();
  const { users, loading, error } = useUsers();
  const [savedIds, setSavedIds] = useState(() =>
    currentUser ? getSavedIds(currentUser.id) : []
  );

  function removeSaved(id) {
    const updatedIds = savedIds.filter((savedId) => savedId !== String(id));
    setSavedIds(updatedIds);
    storeSavedIds(currentUser.id, updatedIds);
  }

  if (!currentUser) return <LoginPrompt title="Log in to see who you saved" />;
  if (loading) return <p className="p-10 text-center text-gray-500">Loading saved people...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  const savedUsers = users.filter((user) => savedIds.includes(String(user.id)));

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="animate-rise rounded-3xl bg-linear-to-r from-pink-100 via-rose-100 to-purple-100 p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Saved</h1>
        <p className="mt-2 text-gray-600">
          {savedUsers.length} {savedUsers.length === 1 ? "person" : "people"} you'd like to swap skills with
        </p>
      </header>

      {savedUsers.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedUsers.map((user, index) => (
            <div key={user.id} className="animate-rise" style={{ animationDelay: `${index * 80}ms` }}>
              <MatchCard
                id={user.id}
                name={user.name}
                location={user.location}
                initials={getInitials(user.name)}
                canTeach={user.offers || []}
                wantsToLearn={user.wants || []}
                duration={user.timeToLearn || "To be agreed"}
                amount="Skill swap"
                isSaved={true}
                onToggleSave={removeSaved}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-rise mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">No saved people yet</h2>
          <p className="mt-2 text-gray-500">
            Search for a skill on Discover, then save the people you like.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-full bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            Start searching
          </Link>
        </div>
      )}
    </div>
  );
}

export default SavedMatches;
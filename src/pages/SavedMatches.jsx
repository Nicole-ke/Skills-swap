
import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem("skillswap_saved_users") || "[]");
  } catch {
    return [];
  }
}

function SavedMatches() {
  const [users, setUsers] = useState([]);
  const [savedIds, setSavedIds] = useState(getSavedIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function removeSaved(id) {
    const updatedIds = savedIds.filter(
      (savedId) => savedId !== String(id)
    );

    setSavedIds(updatedIds);
    localStorage.setItem("skillswap_saved_users", JSON.stringify(updatedIds));
  }

  const savedUsers = users.filter((user) =>
    savedIds.includes(String(user.id))
  );

  if (loading) return <p className="p-6">Loading saved matches...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">Saved Matches ❤️</h1>
        <p className="mt-2 text-gray-600">
          People you have saved for future skill exchanges.
        </p>

        {savedUsers.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedUsers.map((user) => (
              <MatchCard
                key={user.id}
                id={user.id}
                name={user.name}
                location={user.location}
                initials={user.name.split(" ").map((word) => word[0]).join("").toUpperCase()}
                canTeach={user.offers || []}
                wantsToLearn={user.wants || []}
                duration="To be agreed"
                amount="To be agreed"
                isSaved={true}
                onToggleSave={removeSaved}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-4xl">♡</p>
            <h2 className="mt-3 text-xl font-semibold">No saved matches yet</h2>
            <p className="mt-2 text-gray-500">
              Visit Matches and save people you would like to connect with.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedMatches;

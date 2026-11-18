
import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem("skillswap_saved_users") || "[]");
  } catch {
    return [];
  }
}

function Matches() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  function toggleSave(id) {
    const idString = String(id);

    setSavedIds((currentIds) => {
      const updatedIds = currentIds.includes(idString)
        ? currentIds.filter((savedId) => savedId !== idString)
        : [...currentIds, idString];

      localStorage.setItem("skillswap_saved_users", JSON.stringify(updatedIds));
      return updatedIds;
    });
  }

  const demoUser = users.find((user) => Number(user.id) === 1);

  const matchedUsers = users
    .filter((user) => Number(user.id) !== 1)
    .map((user) => {
      const skillsTheyCanTeach = (demoUser?.wants || []).filter((skill) =>
        (user.offers || []).some(
          (offer) => offer.toLowerCase() === skill.toLowerCase()
        )
      );

      const skillsYouCanTeach = (user.wants || []).filter((skill) =>
        (demoUser?.offers || []).some(
          (offer) => offer.toLowerCase() === skill.toLowerCase()
        )
      );

      const matchedSkills = [
        ...skillsTheyCanTeach,
        ...skillsYouCanTeach,
      ];

      const totalSkills =
        (demoUser?.wants || []).length + (user.wants || []).length;

      const matchPercentage =
        totalSkills > 0
          ? Math.round(
              ((skillsTheyCanTeach.length + skillsYouCanTeach.length) /
                totalSkills) *
                100
            )
          : 0;

      return {
        ...user,
        matchedSkills,
        skillsTheyCanTeach,
        skillsYouCanTeach,
        matchPercentage,
      };
    });

  const filteredUsers = matchedUsers.filter((user) => {
    const search = searchTerm.toLowerCase();

    const searchableText = [
      user.name,
      user.bio,
      user.location,
      ...(user.offers || []),
      ...(user.wants || []),
      ...(user.matchedSkills || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search);
  });

  if (loading) return <p className="p-6">Loading matches...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!demoUser) return <p className="p-6">Your user profile could not be found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">Your Matches</h1>
        <p className="mt-2 text-gray-600">
          Discover people who can help you learn new skills and learn from you.
        </p>

        <input
          type="text"
          placeholder="Search skills, names, locations or descriptions..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mt-6 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <MatchCard
              key={user.id}
              id={user.id}
              name={user.name}
              location={user.location}
              initials={user.name.split(" ").map((word) => word[0]).join("").toUpperCase()}
              matchPercentage={user.matchPercentage}
              matchedSkills={user.matchedSkills}
              skillsTheyCanTeach={user.skillsTheyCanTeach}
              skillsYouCanTeach={user.skillsYouCanTeach}
              canTeach={user.offers || []}
              wantsToLearn={user.wants || []}
              duration="To be agreed"
              amount="To be agreed"
              isSaved={savedIds.includes(String(user.id))}
              onToggleSave={toggleSave}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            No matching users found. Try another search.
          </p>
        )}
      </div>
    </div>
  );
}

export default Matches;

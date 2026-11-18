
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Profile not found");
        }
        return response.json();
      })
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const message = `Hello ${user.name}, I found your profile on SkillSwap and would like to exchange skills.`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <Link to="/" className="text-purple-600 hover:underline">
          ← Back to Matches
        </Link>

        <div className="mt-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-700">
            {user.name.split(" ").map((word) => word[0]).join("")}
          </div>

          <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">📍 {user.location}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-bold">About</h2>
          <p className="mt-2 text-gray-600">{user.bio || "No bio available."}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-bold">Skills I can teach</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {(user.offers || []).map((skill) => (
              <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-bold">Skills I want to learn</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {(user.wants || []).map((skill) => (
              <span key={skill} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8 block rounded-xl bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700"
        >
          Contact on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default Profile;

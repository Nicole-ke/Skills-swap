
import { Link } from "react-router-dom";

function MatchCard({
  id,
  name,
  location,
  initials,
  matchPercentage = 0,
  matchedSkills = [],
  skillsTheyCanTeach = [],
  skillsYouCanTeach = [],
  canTeach = [],
  wantsToLearn = [],
  duration = "To be agreed",
  amount = "To be agreed",
  isSaved = false,
  onToggleSave,
}) {
  const message = `Hello ${name}, I found your profile on SkillSwap and would like to exchange skills.`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500">📍 {location}</p>
        </div>

        <div className="ml-auto text-center">
          <p className="text-xl font-bold text-purple-700">{matchPercentage}%</p>
          <p className="text-xs text-gray-500">Match</p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 font-semibold">Skills they can teach</h3>
        <div className="flex flex-wrap gap-2">
          {canTeach.map((skill) => (
            <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 font-semibold">Skills they want to learn</h3>
        <div className="flex flex-wrap gap-2">
          {wantsToLearn.map((skill) => (
            <span key={skill} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {matchedSkills.length > 0 && (
        <div className="mt-5 rounded-xl bg-purple-50 p-4">
          <h3 className="font-semibold text-purple-900">Shared skill matches</h3>
          <div className="mt-2 space-y-2 text-sm text-purple-800">
            {skillsTheyCanTeach.map((skill) => (
              <p key={`teach-you-${skill}`}>✓ They can teach you: {skill}</p>
            ))}
            {skillsYouCanTeach.map((skill) => (
              <p key={`teach-them-${skill}`}>✓ You can teach them: {skill}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-between text-sm text-gray-600">
        <span>Duration: {duration}</span>
        <span>{amount}</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/profile/${id}`}
          className="flex-1 rounded-xl bg-purple-600 py-3 text-center font-semibold text-white hover:bg-purple-700"
        >
          View Profile
        </Link>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700"
        >
          WhatsApp
        </a>
      </div>

      <button
        type="button"
        onClick={() => onToggleSave?.(id)}
        className={`mt-3 w-full rounded-xl border py-3 font-semibold transition ${
          isSaved
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {isSaved ? "♥ Remove from Saved" : "Save Match"}
      </button>
    </div>
  );
}

export default MatchCard;

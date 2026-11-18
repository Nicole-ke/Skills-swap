
function MatchCard({
  name,
  location,
  initials,
  matchPercentage,
  canTeach,
  wantsToLearn,
  duration,
  amount,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700">
          {initials}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {name}
          </h2>
          <p className="text-sm text-gray-500">
            {location}
          </p>
        </div>

        <div className="ml-auto text-center">
          <p className="text-2xl font-bold text-green-600">
            {matchPercentage}%
          </p>
          <p className="text-xs text-gray-500">Match</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-gray-700">
          Can teach you
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {canTeach.map((skill) => (
            <span
              key={skill}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700">
          Wants to learn
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {wantsToLearn.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
        <div>
          <p className="text-xs text-gray-500">Learning duration</p>
          <p className="font-semibold text-gray-800">{duration}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Initial amount</p>
          <p className="font-semibold text-gray-800">{amount}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
          View Profile
        </button>

        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          WhatsApp
        </button>
      </div>
    </div>
  );
}

export default MatchCard;

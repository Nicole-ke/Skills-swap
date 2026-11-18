

import MatchCard from "../components/MatchCard";

function Matches() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900">
          Your Matches
        </h1>

        <p className="text-gray-600 mt-2">
          Discover people who can help you learn new skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          <MatchCard />

          <MatchCard />

          <MatchCard />

        </div>

      </div>

    </div>
  );
}

export default Matches;

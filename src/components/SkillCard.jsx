const pastels = [
  "bg-pink-100",
  "bg-purple-100",
  "bg-sky-100",
  "bg-emerald-100",
  "bg-amber-100",
  "bg-rose-100",
]

function SkillCard({ person, onClick }) {
  // Same person always gets the same colour
  const colour = pastels[person.name.length % pastels.length]

  return (
    <div
      onClick={onClick}
      className={`${colour} rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition`}
    >
      {/* Top bar, like an Instagram post */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={person.photo}
          alt=""
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
        />
        <div>
          <p className="font-semibold text-gray-800">{person.name}</p>
          <p className="text-xs text-gray-500">
            Teaches {(Array.isArray(person.offers) ? person.offers : []).join(", ") || "Various skills"}
          </p>
        </div>
      </div>

      {/* Square photo */}
      <div className="px-3">
        <img
          src={person.photo}
          alt={person.name}
          className="w-full aspect-square object-cover rounded-2xl"
        />
      </div>

      {/* Caption tags */}
      <div className="p-4 flex flex-wrap gap-2">
        <span className="bg-white/70 text-gray-700 text-xs px-3 py-1 rounded-full">
          {person.timeToLearn || "Flexible timing"}
        </span>
        <span className="bg-white/70 text-gray-700 text-xs px-3 py-1 rounded-full">
         Wants {(Array.isArray(person.wants) ? person.wants : []).join(", ") || "Anything new"}
        </span>
      </div>
    </div>
  )
}

export default SkillCard
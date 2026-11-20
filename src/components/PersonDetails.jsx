function PersonDetails({ person, onBack, onLike, isMatched, showWhatsApp }) {
  const offered = Array.isArray(person.offers) ? person.offers : []
  const wanted = Array.isArray(person.wants) ? person.wants : []
  const message = `Hi ${person.name}! I saw you on SkillSwap and would like to exchange skills.`
  const whatsappLink = `https://wa.me/${person.phone}?text=${encodeURIComponent(message)}`

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="mb-4 text-purple-600 hover:underline">
        ← Back
      </button>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <img
          src={person.photo}
          alt={person.name}
          className="w-full aspect-square object-cover"
        />

        <div className="p-6 space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">{person.name}</h2>
          <p className="text-gray-500">{person.location}</p>
          <p className="pt-2"><span className="font-semibold">Can teach:</span> {offered.join(", ") || "Not listed"}</p>
          <p><span className="font-semibold">Takes about:</span> {person.timeToLearn || "To be agreed"}</p>
          <p><span className="font-semibold">Wants to learn:</span> {wanted.join(", ") || "Open to ideas"}</p>

          {onLike && (
            <button
              onClick={() => onLike(person)}
              disabled={isMatched}
              className="w-full mt-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200 disabled:opacity-60"
            >
              {isMatched ? " In your matches" : "Add to matches"}
            </button>
          )}

          {showWhatsApp && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full mt-4 bg-emerald-400 text-white py-3 rounded-full font-semibold hover:bg-emerald-500"
            >
               Chat on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonDetails
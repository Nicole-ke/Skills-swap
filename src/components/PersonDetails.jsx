function PersonDetails({ person, onBack, onLike, isMatched, showWhatsApp }) {
  const message = `Hi ${person.name}! I saw you teach ${person.skillOffered} on SkillSwap. Want to swap skills?`
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
          <p> Teaches: {person.skillOffered}</p>
          <p> Takes about: {person.timeToLearn}</p>
          <p> Wants in exchange: {person.skillWanted}</p>

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
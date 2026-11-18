import { useState, useEffect } from "react"
import SkillCard from "./SkillCard"
import SwipeDeck from "./SwipeDeck"
import PersonDetails from "./PersonDetails"

const API = "http://localhost:3000"

function CardsSection({ search = "" }) {
  const [people, setPeople] = useState([])
  const [matches, setMatches] = useState([])
  const [view, setView] = useState("home") // "home", "swipe", "details"
  const [selected, setSelected] = useState(null)
  const [cameFrom, setCameFrom] = useState("home")
  const [error, setError] = useState(null)

  // Load people and matches from db.json when the page opens
  useEffect(() => {
    fetch(`${API}/people`)
      .then((res) => res.json())
      .then((data) => setPeople([...data].sort(() => Math.random() - 0.5))) // shuffle
      .catch(() => setError("Can't reach the database. Is json-server running?"))

    fetch(`${API}/matches`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
  }, [])

  const results = people.filter((p) =>
    p.skillOffered.toLowerCase().includes(search.toLowerCase())
  )

  const isMatched = (person) => matches.some((m) => m.personId === person.id)

  // Save a liked person into db.json "matches"
  const addToMatches = (person) => {
    if (isMatched(person)) return

    fetch(`${API}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...person, personId: person.id }),
    })
      .then((res) => res.json())
      .then((saved) => setMatches((prev) => [...prev, saved]))
  }

  const openDetails = (person, from) => {
    setSelected(person)
    setCameFrom(from)
    setView("details")
  }

  if (error) {
    return <p className="text-center text-red-500 p-8">{error}</p>
  }

  return (
    <section className="max-w-6xl mx-auto p-6">

      {/* DISCOVER GRID */}
      {view === "home" && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Discover </h1>
            <div className="flex items-center gap-3">
              <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">
                 {matches.length} matches
              </span>
              <button
                onClick={() => setView("swipe")}
                className="bg-purple-300 text-purple-900 px-5 py-2 rounded-full font-semibold hover:bg-purple-400"
              >
                Start swiping 
              </button>
            </div>
          </div>

          {results.length === 0 ? (
            <p className="text-gray-500">Nobody teaches that... yet </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((person) => (
                <SkillCard
                  key={person.id}
                  person={person}
                  onClick={() => openDetails(person, "home")}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/*  SWIPE (hidden, not removed, so it remembers where you stopped) */}
      <div className={view === "swipe" ? "" : "hidden"}>
        <button
          onClick={() => setView("home")}
          className="mb-4 text-purple-600 hover:underline"
        >
          ← Back to Discover
        </button>
        <SwipeDeck
          people={results}
          onLike={addToMatches}
          onDone={() => setView("home")}
          onOpen={(p) => openDetails(p, "swipe")}
        />
      </div>

      {/*  DETAILS */}
      {view === "details" && selected && (
        <PersonDetails
          person={selected}
          onBack={() => setView(cameFrom)}
          onLike={addToMatches}
          isMatched={isMatched(selected)}
        />
      )}
    </section>
  )
}

export default CardsSection
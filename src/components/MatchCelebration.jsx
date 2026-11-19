import { useEffect, useState } from "react";

const CONFETTI_COLOURS = ["#f9a8d4", "#c4b5fd", "#93c5fd", "#6ee7b7", "#fcd34d", "#fda4af"];

function MiniCard({ person }) {
  return (
    <div className="w-32 rounded-2xl bg-white p-3 text-center shadow-xl sm:w-36">
      <img
        src={person.photo}
        alt={person.name}
        className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-purple-100"
      />
      <p className="mt-2 truncate font-bold text-gray-900">{person.name.split(" ")[0]}</p>
      <p className="truncate text-xs text-gray-500">{(person.offers || []).join(", ")}</p>
    </div>
  );
}

export default function MatchCelebration({ me, them, onClose }) {
  // orbit -> shake -> done
  const [stage, setStage] = useState("orbit");
  const [confetti] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
    }))
  );

  useEffect(() => {
    const toShake = setTimeout(() => setStage("shake"), 2000);
    const toDone = setTimeout(() => setStage("done"), 3600);
    return () => {
      clearTimeout(toShake);
      clearTimeout(toDone);
    };
  }, []);

  const firstName = them.name.split(" ")[0];
  const message = `Hi ${firstName}! We matched on SkillSwap. When are you free to swap skills?`;
  const whatsappLink = `https://wa.me/${them.phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-purple-950/60 p-4 backdrop-blur-sm">
      {stage !== "orbit" &&
        confetti.map((piece) => (
          <span
            key={piece.id}
            className="fixed top-0 h-3.5 w-2.5 rounded-sm animate-confetti"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.colour,
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}

      <div className="flex flex-col items-center gap-6 text-center">
        {stage === "orbit" && (
          <>
            <div className="animate-orbit flex w-80 items-center justify-between sm:w-96">
              <div className="animate-counter-orbit">
                <MiniCard person={me} />
              </div>
              <div className="animate-counter-orbit">
                <MiniCard person={them} />
              </div>
            </div>
            <p className="text-lg font-semibold text-white">Matching you with {firstName}...</p>
          </>
        )}

        {stage !== "orbit" && (
          <>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="animate-pop">
                <MiniCard person={me} />
              </div>
              <span className={`text-5xl sm:text-6xl ${stage === "shake" ? "animate-handshake" : ""}`}>
                🤝
              </span>
              <div className="animate-pop">
                <MiniCard person={them} />
              </div>
            </div>
            <h2 className="animate-pop text-3xl font-extrabold text-white">It's a match!</h2>
            <p className="text-purple-100">You and {firstName} can now swap skills.</p>
          </>
        )}

        {stage === "done" && (
          <div className="animate-pop flex w-full max-w-xs flex-col gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-500 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600"
            >
              Chat on WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/20 py-3 font-semibold text-white transition hover:bg-white/30"
            >
              Keep exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
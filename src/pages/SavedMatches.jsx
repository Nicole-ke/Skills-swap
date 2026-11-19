import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import LoginPrompt from "../components/LoginPrompt";
import MatchCelebration from "../components/MatchCelebration";
import useUsers from "../hooks/useUsers";
import useRequests from "../hooks/useRequests";
import { getCurrentUser } from "../utils/auth";
import { getSavedIds, storeSavedIds } from "../utils/saved";
import {
  sendMatchRequest,
  acceptMatchRequest,
  getCelebrated,
  markCelebrated,
} from "../utils/requests";

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function SavedMatches() {
  const currentUser = getCurrentUser();
  const myId = currentUser ? String(currentUser.id) : null;

  const { users, loading, error } = useUsers();
  const { requests, refresh } = useRequests(myId);
  const [savedIds, setSavedIds] = useState(() =>
    currentUser ? getSavedIds(currentUser.id) : []
  );
  const [celebrating, setCelebrating] = useState(null);

  const me = users.find((user) => String(user.id) === myId) || currentUser;

  // When a request involving me gets accepted, play the celebration once, on both screens.
  useEffect(() => {
    if (!myId || users.length === 0 || celebrating) return;

    const seen = getCelebrated(myId);
    const newMatch = requests.find(
      (r) => r.status === "accepted" && !seen.includes(String(r.id))
    );
    if (!newMatch) return;

    markCelebrated(myId, newMatch.id);
    const otherId = newMatch.fromId === myId ? newMatch.toId : newMatch.fromId;
    const other = users.find((user) => String(user.id) === otherId);
    if (!other) return;

    setSavedIds((ids) => {
      if (ids.includes(otherId)) return ids;
      const updated = [...ids, otherId];
      storeSavedIds(myId, updated);
      return updated;
    });
    setCelebrating(other);
  }, [requests, users, myId, celebrating]);

  function requestWith(otherId) {
    return requests.find(
      (r) =>
        (r.fromId === myId && r.toId === otherId) ||
        (r.fromId === otherId && r.toId === myId)
    );
  }

  function removeSaved(id) {
    const updatedIds = savedIds.filter((savedId) => savedId !== String(id));
    setSavedIds(updatedIds);
    storeSavedIds(myId, updatedIds);
  }

  async function handleRequest(user) {
    await sendMatchRequest(me, user);
    refresh();
  }

  async function handleAccept(request) {
    await acceptMatchRequest(request.id);
    refresh();
  }

  if (!currentUser) return <LoginPrompt title="Log in to see who you saved" />;
  if (loading) return <p className="p-10 text-center text-gray-500">Loading saved people...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  const savedUsers = users.filter((user) => savedIds.includes(String(user.id)));
  const incoming = requests.filter((r) => r.toId === myId && r.status === "pending");

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="animate-rise rounded-3xl bg-linear-to-r from-pink-100 via-rose-100 to-purple-100 p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Saved</h1>
        <p className="mt-2 text-gray-600">
          Send a match request. When they accept, you can chat on WhatsApp.
        </p>
      </header>

      {incoming.length > 0 && (
        <section className="animate-rise mt-6 space-y-3">
          {incoming.map((request) => {
            const sender = users.find((user) => String(user.id) === request.fromId);
            return (
              <div
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {sender?.photo && (
                    <img src={sender.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {request.fromName} wants to swap skills with you
                    </p>
                    <p className="text-sm text-gray-500">
                      Teaches {(sender?.offers || []).join(", ")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAccept(request)}
                  className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
                >
                  Accept
                </button>
              </div>
            );
          })}
        </section>
      )}

      {savedUsers.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedUsers.map((user, index) => {
            const request = requestWith(String(user.id));
            const firstName = user.name.split(" ")[0];
            const isMatched = request?.status === "accepted";

            return (
              <div
                key={user.id}
                className="animate-rise flex flex-col gap-3"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <MatchCard
                  id={user.id}
                  name={user.name}
                  location={user.location}
                  initials={getInitials(user.name)}
                  canTeach={user.offers || []}
                  wantsToLearn={user.wants || []}
                  duration={user.timeToLearn || "To be agreed"}
                  amount="Skill swap"
                  phone={user.phone}
                  showWhatsApp={isMatched}
                  isSaved={true}
                  onToggleSave={removeSaved}
                />

                {!request && (
                  <button
                    type="button"
                    onClick={() => handleRequest(user)}
                    className="rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
                  >
                     Request to match
                  </button>
                )}
                {request?.status === "pending" && request.fromId === myId && (
                  <p className="animate-pulse rounded-xl bg-amber-50 py-3 text-center text-sm font-medium text-amber-700">
                    Request sent. Waiting for {firstName} to accept...
                  </p>
                )}
                {request?.status === "pending" && request.toId === myId && (
                  <button
                    type="button"
                    onClick={() => handleAccept(request)}
                    className="rounded-xl bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600"
                  >
                    Accept {firstName}'s request
                  </button>
                )}
                {isMatched && (
                  <p className="rounded-xl bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-700">
                    ✓ Matched with {firstName}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        incoming.length === 0 && (
          <div className="animate-rise mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">No saved people yet</h2>
            <p className="mt-2 text-gray-500">
              Search for a skill on Discover, then save the people you like.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-full bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700"
            >
              Start searching
            </Link>
          </div>
        )
      )}

      {celebrating && (
        <MatchCelebration me={me} them={celebrating} onClose={() => setCelebrating(null)} />
      )}
    </div>
  );
}

export default SavedMatches;
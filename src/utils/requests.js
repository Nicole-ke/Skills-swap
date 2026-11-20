import { API_URL } from "../hooks/useUsers";

const headers = { "Content-Type": "application/json" };

export function sendMatchRequest(fromUser, toUser) {
  return fetch(`${API_URL}/requests`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      fromId: String(fromUser.id),
      fromName: fromUser.name,
      toId: String(toUser.id),
      toName: toUser.name,
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
  });
}

export function acceptMatchRequest(requestId) {
  return fetch(`${API_URL}/requests/${requestId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status: "accepted" }),
  });
}

// Remember which matches this user has already celebrated so the animation plays once.
function celebratedKey(userId) {
  return `skillswap_celebrated_${userId}`;
}

export function getCelebrated(userId) {
  try {
    return JSON.parse(localStorage.getItem(celebratedKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function markCelebrated(userId, requestId) {
  const seen = getCelebrated(userId);
  localStorage.setItem(celebratedKey(userId), JSON.stringify([...seen, String(requestId)]));
}
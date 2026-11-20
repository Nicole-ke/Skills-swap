import { useCallback, useEffect, useState } from "react";
import { API_URL } from "./useUsers";

// Checks for new match requests every few seconds so both people see updates without refreshing.
export default function useRequests(userId, intervalMs = 3000) {
  const [requests, setRequests] = useState([]);

  const refresh = useCallback(() => {
    if (!userId) return;
    fetch(`${API_URL}/requests`)
      .then((res) => (res.ok ? res.json() : []))
      .then((all) =>
        setRequests(
          all.filter((r) => r.fromId === String(userId) || r.toId === String(userId))
        )
      )
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, intervalMs);
    return () => clearInterval(timer);
  }, [refresh, intervalMs]);

  return { requests, refresh };
}
import { useEffect, useState } from "react";

export const API_URL = "http://localhost:3000";

export default function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/users`)
        .then((response) => {
            if (!response.ok) throw new Error ("Could not load users. Is json-server running?");
            return response.json();
        })

        .then(setUsers)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
        
    },[]);

    return { users, loading, error };
    
}
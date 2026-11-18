import { useEffect, useState } from "react";
import SearchBar from "./components/searchBar";
import { mockUsers } from "./mockData";
import { BASE_URL } from "./utils/utils";

function App() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const results = users.filter(
    (
      u, // used to filter the mockusers array every time the component changes
    ) =>
      [u.name, u.location, ...(u.offers ?? []), ...(u.wants ?? [])] //does she have a name..yes....loction...yes...wants (if she doesnt it remains emptyand also offers)
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()), //to prevent submission of blank spaces
  );
  return (
    <div style={{ padding: 24 }}>
      <SearchBar value={query} onChange={setQuery} />
      <p>{results.length} people found</p>
      <ul>
        {results.map((u) => (
          <li key={u.id}>
            {u.name}: {u.offers.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;

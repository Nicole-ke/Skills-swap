import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import SavedMatches from "./pages/SavedMatches";

import { useState } from "react";
import CardsSection from "./components/CardsSection";

function App() {
  const [search, setSearch] = useState("");
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <Link to="/" className="text-2xl font-bold text-purple-700">
            SkillSwap
          </Link>

          <div className="flex gap-5 font-medium text-gray-700">
            <Link to="/discover" className="hover:text-purple-600">
              Discover
            </Link>
            <Link to="/" className="hover:text-purple-600">
              Matches
            </Link>
            <Link to="/saved" className="hover:text-purple-600">
              ♥ Saved
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Matches />} />
          <Route path="/saved" element={<SavedMatches />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/discover" element={<CardsSection search={search} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import SavedMatches from "./pages/SavedMatches";
import SkillForm from "./pages/SkillForm";
import LoginForm from "./pages/LoginForm";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <Link to="/" className="text-2xl font-bold text-purple-700">
            SkillSwap
          </Link>

          <div className="flex gap-5 font-medium text-gray-700">
            <Link to="/" className="hover:text-purple-600">
              Matches
            </Link>
            <Link to="/saved" className="hover:text-purple-600">
              ♥ Saved
            </Link>
            <Link to="/skills" className="hover:text-purple-600">
              Add your skills
            </Link>
            <Link to="/login" className="hover:text-purple-600">
              Login
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Matches />} />
          <Route path="/saved" element={<SavedMatches />} />
          <Route path="/skills" element={<SkillForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

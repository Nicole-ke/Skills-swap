import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CardsSection from "./components/CardsSection";
import Matches from "./pages/Matches";
import SavedMatches from "./pages/SavedMatches";
import SkillForm from "./pages/SkillForm";
import LoginForm from "./pages/LoginForm";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-rose-50/40">
        <Navbar />
        <Routes>
          <Route path="/" element={<CardsSection />} />
          <Route path="/discover" element={<CardsSection />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/saved" element={<SavedMatches />} />
          <Route path="/skills" element={<SkillForm />} />
          <Route path="/signup" element={<SkillForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/discover" element={<CardsSection />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
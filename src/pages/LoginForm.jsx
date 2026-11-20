import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/utils";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) throw new Error("Could not check profiles.");

      const users = await response.json();
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find((profile) =>
        (profile.email || "").trim().toLowerCase() === normalizedEmail
      );

      if (!user || user.password !== password) {
        setMessage("Wrong email or password. Please try again.");
        return;
      }

      const profile = { ...user };
      delete profile.password;
      localStorage.setItem("skillswap_current_user", JSON.stringify(profile));
      navigate("/");
    } catch {
      setMessage("Can't reach the server. Start JSON Server and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-[1fr_440px] md:px-8">
      <section className="hidden min-h-130 overflow-hidden rounded-3xl bg-[#17151f] text-white md:flex md:flex-col md:justify-between">
        <div className="p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">SkillSwap</p>
          <h1 className="mt-6 max-w-md text-5xl font-black leading-[1.05]">
            Learn something new from someone nearby.
          </h1>
        </div>
        <div className="grid grid-cols-2 border-t border-white/10">
          <div className="p-7">
            <p className="text-3xl font-black text-pink-300">40+</p>
            <p className="mt-1 text-sm text-white/65">skills to swap</p>
          </div>
          <div className="border-l border-white/10 p-7">
            <p className="text-3xl font-black text-sky-300">1:1</p>
            <p className="mt-1 text-sm text-white/65">human exchange</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm font-bold text-purple-700">Welcome back</p>
          <h2 className="mt-2 text-4xl font-black text-gray-950">Sign in</h2>
          <p className="mt-3 text-gray-500">Continue to your skill exchanges.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-16 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
              <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gray-950 px-4 py-3.5 font-bold text-white transition hover:bg-purple-700 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {message && <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">{message}</p>}

        <p className="mt-7 text-center text-sm text-gray-600">
          New to SkillSwap?{" "}
          <Link to="/signup" className="font-bold text-purple-700 hover:text-purple-900">Create an account</Link>
        </p>
      </section>
    </main>
  );
}


  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { setCurrentUser } from "../utils/auth";
  import { API_URL } from "../hooks/useUsers";

  export default function LoginForm() {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get("email").trim().toLowerCase();
      const password = formData.get("password");

      setSubmitting(true);
      setMessage("");

      try {
        const response = await fetch (`${API_URL}/users`);
        const users = await response.json();
        const user = users.find((u) => (u.email || "").toLowerCase() === email);

        if (!user || user.password !== password) {
          setMessage ("Wrong email or password. Please try again");
          return;
        }

        //Dont keep the password in localStorage
        const { password: _password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        navigate("/");
      } catch {
          setMessage("Can't reach the server. Is json-server running?");
        } finally {
          setSubmitting(false);

        }
      }
    


  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-purple-900/5 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl font-bold text-purple-700">
            S
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your skill exchange.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <button
                type="button"
                className="text-sm font-medium text-purple-700 hover:text-purple-800"
                onClick={() =>
                  setMessage("Password reset is not available yet.")
                }
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            Sign in
          </button>
        </form>

        {message && (
          <p
            className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800"
            role="status"
          >
            {message}
          </p>
        )}

        <p className="mt-7 text-center text-sm text-gray-600">
          New to SkillSwap?{" "}
          <Link
            to="/skills"
            className="font-semibold text-purple-700 hover:text-purple-800"
          >
            Create a profile
          </Link>
        </p>
      </section>
    </main>
  );
}



import { Link } from "react-router-dom";

export default function LoginPrompt({ title = "Log in to continue" }) {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="animate-rise rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
          
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">
          You need an account to find and save people to swap skills with.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-full bg-purple-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
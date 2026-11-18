import { useEffect, useState } from "react";

export default function SearchBar({ value, onChange }) {
  const [text, setText] = useState(value ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(text);
    }, 300);

    return () => clearTimeout(timer);
  }, [text, onChange]);

  function handleClear() {
    setText("");
    onChange("");
  }

  return (
    <div className="relative w-full">
      <input
        className="h-12 w-full rounded-full border border-indigo-200 bg-white px-5 pr-20 text-base text-slate-900 shadow-md outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search skills, e.g. guitar, Python"
        aria-label="Search skills"
      />
      {text.length > 0 ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
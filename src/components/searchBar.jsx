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
    <div className="relative w-full max-w-md bg-gray-50">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search skills, e.g. guitar, Python"
        aria-label="Search skills"
      />
      {text.length > 0 ? (
        <button type="button" onClick={handleClear} aria-label="Clear search">
          Clear
        </button>
      ) : null}
    </div>
  );
}
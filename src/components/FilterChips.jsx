import { useEffect, useState } from "react";

export default function FilterChips({ options, selected, onSelect }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option === selected;

        return (
          <button
            key={option}
            type="button"
            className={
              isSelected ? "chip chip-selected" : "chip"
              
            }
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
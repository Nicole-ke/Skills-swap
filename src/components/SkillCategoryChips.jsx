export default function SkillCategoryChips({ categories, selectedCategory, onSelect }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by skill category">
      {categories.map(({ name }) => {
        const isSelected = selectedCategory === name;

        return (
          <button
            key={name}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(name)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
export default function Logo() {
  return (
    <span
      aria-label="SkillSwap"
      className="inline-flex items-center text-3xl italic text-purple-600 font-serif"
    >
      Skill

      {/* Custom green arrow "S" */}
      <svg
        viewBox="0 0 60 80"
        className="h-9 w-7 text-emerald-600 mx-0.5 translate-y-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Main "S" curve */}
        <path d="M50 16 C44 4, 14 2, 14 22 C14 42, 48 36, 46 58 C44 76, 20 80, 6 66" />
        
        {/* Top arrowhead */}
        <path d="M40 16 L51 17 L48 6" />
        
        {/* Bottom arrowhead */}
        <path d="M16 66 L5 65 L8 76" />
      </svg>

      wap
    </span>
  );
}
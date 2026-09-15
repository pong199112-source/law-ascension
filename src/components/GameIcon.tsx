import type { ReactNode } from "react";

// One illustrated icon family: rounded ink outlines, warm paper, colored enamel and highlights.
const drawings: Record<string, ReactNode> = {
  civil: (
    <>
      <path d="M24 8v30M15 38h18M8 17h32" />
      <path
        d="m12 18-7 13h14zm24 0-7 13h14z"
        fill="var(--icon-color,#d6ad66)"
      />
      <path d="M5 31q7 10 14 0m10 0q7 10 14 0" fill="#fff6d9" />
      <circle cx="24" cy="11" r="4" fill="#f6cf80" />
    </>
  ),
  criminal: (
    <>
      <path d="m20 25 15 15" strokeWidth="7" />
      <path
        d="m20 25 15 15"
        stroke="var(--icon-color,#d5867c)"
        strokeWidth="3"
      />
      <g transform="rotate(-42 20 18)">
        <rect
          x="7"
          y="9"
          width="25"
          height="17"
          rx="4"
          fill="var(--icon-color,#d5867c)"
        />
        <path d="M12 12v11m15-11v11" stroke="#fff6e6" />
      </g>
      <path d="M10 38h15l4 5H6z" fill="#e8c78c" />
    </>
  ),
  "civil-procedure": (
    <>
      <path d="M13 6h20l6 7v27H13z" fill="#fff9e8" />
      <path d="M33 6v8h6M18 18h13m-13 6h13m-13 6h8" />
      <path d="M13 6H9v34a3 3 0 0 0 6 0" fill="var(--icon-color,#80a5c5)" />
      <path d="m30 39 5-14 7-8 2 3-7 10z" fill="var(--icon-color,#80a5c5)" />
    </>
  ),
  "criminal-procedure": (
    <>
      <path d="M9 6h24v32H9z" fill="#fff9e8" />
      <path d="M15 13h12m-12 6h9m-9 6h5" />
      <circle cx="30" cy="29" r="9" fill="var(--icon-color,#aa91c5)" />
      <circle cx="30" cy="29" r="5" fill="#fff9e8" strokeWidth="1.5" />
      <path d="m36 36 7 7" strokeWidth="5" />
    </>
  ),
  court: (
    <>
      <path d="m5 17 19-11 19 11z" fill="var(--icon-color,#c7a35d)" />
      <path
        d="M7 39h34v5H7zM10 19h6v18h-6zm11 0h6v18h-6zm11 0h6v18h-6z"
        fill="#fff5da"
      />
      <path d="M7 37h34M5 18h38" />
      <circle cx="24" cy="13" r="2" fill="#fff5da" stroke="none" />
    </>
  ),
  glasses: (
    <>
      <path d="m6 23 2-10h7m27 10-2-10h-7" />
      <circle cx="13" cy="28" r="9" fill="#ede5f5" />
      <circle cx="35" cy="28" r="9" fill="#ede5f5" />
      <path d="M22 26q2-3 4 0M8 25l3-3m19 3 3-3" stroke="#fff" />
    </>
  ),
  pen: (
    <>
      <path d="m9 39 3-11L32 8q4-4 8 0t0 8L20 36z" fill="#a5c4e4" />
      <path d="m12 28 8 8m9-23 8 8M9 39l-2 3m13-15 9-9" />
      <path d="m9 39 3-11 8 8z" fill="#f3cf8e" />
    </>
  ),
  bag: (
    <>
      <rect x="7" y="16" width="34" height="26" rx="6" fill="#b98f79" />
      <path d="M17 16v-5q7-7 14 0v5M8 24q16 13 32 0" />
      <rect x="21" y="25" width="6" height="7" rx="2" fill="#f6d891" />
      <path d="M12 34v3m24-3v3" stroke="#e7c4a9" />
    </>
  ),
  watch: (
    <>
      <path d="M18 5h12l3 12-3 26H18l-3-26z" fill="#d8a77e" />
      <circle cx="24" cy="24" r="13" fill="#efcc85" />
      <circle cx="24" cy="24" r="9" fill="#fff8df" />
      <path d="M24 18v7l5 2" />
    </>
  ),
  tablet: (
    <>
      <rect x="9" y="5" width="31" height="39" rx="5" fill="#9ab6ad" />
      <rect x="13" y="10" width="23" height="27" rx="2" fill="#e8f0e4" />
      <path d="m17 17 7-4m-7 11 14-8" stroke="#fff" />
      <circle cx="24" cy="40" r="1" />
    </>
  ),
  "id-card": (
    <>
      <path d="m16 5 8 15L33 5" fill="none" stroke="#dba2ac" strokeWidth="5" />
      <rect x="10" y="18" width="28" height="26" rx="4" fill="#fff8e8" />
      <circle cx="20" cy="28" r="4" fill="#dba2ac" />
      <path d="M15 37q5-8 10 0m4-10h5m-5 6h5" />
      <path d="M21 19h6" />
    </>
  ),
  book: (
    <>
      <path
        d="M24 12Q13 6 5 11v29q8-5 19 1 11-6 19-1V11q-8-5-19 1z"
        fill="#fff5df"
      />
      <path d="M24 12v29M10 18l8 1m-8 6 8 1m12-7 8-1m-8 8 8-1" />
      <path d="M29 11v14l4-3 4 2V9" fill="#df94a6" />
    </>
  ),
  quest: (
    <>
      <rect x="9" y="9" width="30" height="35" rx="5" fill="#fff5df" />
      <rect x="17" y="5" width="14" height="9" rx="3" fill="#c7aecb" />
      <path d="m15 23 3 3 5-6m4 4h6m-18 9h4m8 0h6" />
    </>
  ),
  wardrobe: (
    <>
      <path
        d="M20 12a4 4 0 1 1 5 4v5L5 34q-3 5 2 6h34q5-1 2-6L25 21"
        fill="#f5d4db"
      />
    </>
  ),
  home: (
    <>
      <path d="M9 22v21h30V22L24 9z" fill="#f4d6bf" />
      <path d="m4 23 20-18 20 18" stroke="#c88987" strokeWidth="5" />
      <path d="M20 43V29h9v14" fill="#fff7e6" />
      <path d="M14 25h3" />
    </>
  ),
  history: (
    <>
      <circle cx="25" cy="25" r="17" fill="#f2e8d9" />
      <path d="M25 14v12l8 5M7 7v12h11" />
      <path d="M8 16q8-13 22-9" />
    </>
  ),
  crown: (
    <>
      <path d="m7 13 8 8 9-13 9 13 8-8-5 24H12z" fill="#edc678" />
      <path d="M12 40h24M17 27v4m7-9v9m7-4v4" stroke="#fff8e5" />
      <circle cx="7" cy="11" r="3" fill="#edc678" />
      <circle cx="41" cy="11" r="3" fill="#edc678" />
    </>
  ),
  flame: (
    <>
      <path
        d="M25 4q2 13 12 17 13 23-12 24Q3 43 9 26q1 4 5 5-3-15 11-27z"
        fill="#e8ab80"
      />
      <path
        d="M25 22q0 7 5 11 5 10-5 10-14-1 0-21z"
        fill="#f7d38d"
        stroke="none"
      />
    </>
  ),
  calendar: (
    <>
      <rect x="7" y="11" width="34" height="32" rx="5" fill="#fff7e9" />
      <path d="M7 21h34M16 6v10m16-10v10" />
      <path d="M14 27h5v5h-5zm14 0h5v5h-5z" fill="#bca6c8" stroke="none" />
    </>
  ),
  gift: (
    <>
      <rect x="9" y="23" width="30" height="20" rx="3" fill="#e9b7bd" />
      <rect x="6" y="16" width="36" height="9" rx="2" fill="#f1c9c9" />
      <path d="M21 16h6v27h-6z" fill="#f5d993" />
      <path d="M24 16C3 18 8-2 24 16c16-18 21 2 0 0z" fill="#f5d993" />
    </>
  ),
  headphones: (
    <>
      <path d="M8 27a16 16 0 0 1 32 0" fill="none" />
      <rect x="5" y="25" width="10" height="16" rx="5" fill="#a88fc0" />
      <rect x="33" y="25" width="10" height="16" rx="5" fill="#a88fc0" />
      <path d="M38 41q-3 5-10 4" />
      <circle cx="25" cy="44" r="3" fill="#e9bd79" />
    </>
  ),
  lock: (
    <>
      <rect x="12" y="21" width="24" height="21" rx="5" fill="#d3c3b5" />
      <path d="M17 21v-7a7 7 0 0 1 14 0v7M24 29v5" />
    </>
  ),
};

export function GameIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      className={`game-icon ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      stroke="#785f55"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {drawings[name] ?? drawings.book}
    </svg>
  );
}

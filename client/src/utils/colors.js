// Avatar colours are Tailwind classes (bg-pink-600). Live cursors need the real colour.
const HEX = {
  'bg-indigo-500': '#6366f1',
  'bg-pink-600': '#db2777',
  'bg-emerald-600': '#059669',
  'bg-sky-600': '#0284c7',
  'bg-amber-600': '#d97706',
  'bg-violet-600': '#7c3aed',
}

export const colorHex = (tailwindClass) => HEX[tailwindClass] ?? '#6366f1'
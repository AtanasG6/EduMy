import { getCardAccent } from './theme'

const LIGHT_BG = [
  '#eef2ff', '#f5f3ff', '#ecfdf5', '#fffbeb', '#fff1f2', '#ecfeff', '#f7fee7', '#fdf4ff',
]

export default function CourseThumbnail({ id, title, src, className = 'h-44' }) {
  if (src) {
    return (
      <div className={`${className} relative overflow-hidden`}>
        <img src={src} alt={title} className="w-full h-full object-cover" />
      </div>
    )
  }

  const idx = (id ?? 0) % LIGHT_BG.length
  const accent = getCardAccent(id)
  const bg = LIGHT_BG[idx]

  return (
    <div
      className={`${className} relative overflow-hidden flex items-center justify-center`}
      style={{ backgroundColor: bg }}
    >
      <span
        className="text-8xl font-black select-none leading-none"
        style={{ color: accent, opacity: 0.18 }}
      >
        {title?.[0]?.toUpperCase()}
      </span>
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }}
      />
    </div>
  )
}

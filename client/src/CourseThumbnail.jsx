import { getCardAccent } from './theme'

export default function CourseThumbnail({ id, title, className = 'h-44' }) {
  const accent = getCardAccent(id)
  return (
    <div
      className={`${className} relative overflow-hidden flex items-center justify-center`}
      style={{ background: '#0a0a0f' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% -10%, ${accent}28 0%, transparent 65%)` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}70, transparent)` }}
      />
      <span
        className="text-9xl font-black select-none leading-none"
        style={{ color: `${accent}1a` }}
      >
        {title?.[0]?.toUpperCase()}
      </span>
    </div>
  )
}

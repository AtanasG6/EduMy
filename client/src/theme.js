export const CARD_ACCENTS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#ec4899', // pink
]

export const getCardAccent = (id) => CARD_ACCENTS[(id ?? 0) % CARD_ACCENTS.length]

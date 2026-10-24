export function digits(value: string): string {
  return value.replaceAll(/\D/gu, '')
}

export function formatPhone(value: string): string {
  const raw = digits(value).slice(0, 11)
  if (raw.length <= 2) return raw.length > 0 ? `(${raw}` : ''
  if (raw.length <= 6) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`
  if (raw.length <= 10) return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`
  return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`
}

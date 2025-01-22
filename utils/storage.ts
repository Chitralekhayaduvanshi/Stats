export const loadData = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === 'undefined') return defaultValue
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : defaultValue
}

export const saveData = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
} 
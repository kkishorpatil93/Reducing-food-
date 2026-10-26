import { useState, useEffect } from 'react'

const STORAGE_KEY = 'foodsave_favorite_listings'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // storage unavailable
    }
  }, [favorites])

  const toggleFavorite = (foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    )
  }

  const isFavorite = (foodId) => favorites.includes(foodId)

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    count: favorites.length,
  }
}

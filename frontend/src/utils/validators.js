/**
 * Client-Side Form Validation Utilities
 */

export const isValidEmail = (email) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export const isValidPassword = (password) => {
  if (!password) return false
  return password.length >= 6
}

export const isFutureDate = (dateString) => {
  if (!dateString) return false
  const timestamp = new Date(dateString).getTime()
  return !isNaN(timestamp) && timestamp > Date.now()
}

export const isAfter = (afterDateStr, beforeDateStr) => {
  if (!afterDateStr || !beforeDateStr) return false
  const tAfter = new Date(afterDateStr).getTime()
  const tBefore = new Date(beforeDateStr).getTime()
  return tAfter > tBefore
}

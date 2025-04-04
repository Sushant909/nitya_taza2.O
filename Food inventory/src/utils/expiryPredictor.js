// This is a simplified ML model simulation for food expiry prediction
// In a real application, this would connect to a trained ML model API

const baseExpiryDays = {
  fruits: 7,
  vegetables: 5,
  dairy: 10,
  meat: 3,
  seafood: 2,
  bakery: 4,
  prepared: 3,
  canned: 730, // 2 years
  frozen: 180, // 6 months
  dry: 365, // 1 year
}

// Temperature impact factors (normalized)
const getTemperatureFactor = (temperature) => {
  // Lower temperature extends shelf life
  if (temperature <= 0) return 1.5 // Freezing extends shelf life
  if (temperature <= 4) return 1.0 // Refrigerator temperature is baseline
  if (temperature <= 10) return 0.7 // Cool room
  if (temperature <= 20) return 0.5 // Room temperature
  if (temperature <= 30) return 0.3 // Warm
  return 0.1 // Hot temperatures significantly reduce shelf life
}

// Humidity impact factors (normalized)
const getHumidityFactor = (humidity, foodType) => {
  // Different foods have different optimal humidity levels
  const dryFoods = ["dry", "bakery", "canned"]
  const moistFoods = ["fruits", "vegetables"]

  if (dryFoods.includes(foodType)) {
    // Dry foods last longer in low humidity
    if (humidity <= 30) return 1.2
    if (humidity <= 50) return 1.0
    if (humidity <= 70) return 0.8
    return 0.6
  } else if (moistFoods.includes(foodType)) {
    // Some fresh produce needs higher humidity
    if (humidity <= 30) return 0.7
    if (humidity <= 50) return 0.9
    if (humidity <= 70) return 1.0
    if (humidity <= 90) return 0.9
    return 0.7
  } else {
    // Default for other food types
    if (humidity <= 30) return 1.1
    if (humidity <= 50) return 1.0
    if (humidity <= 70) return 0.9
    return 0.8
  }
}

// Packaging impact factors
const getPackagingFactor = (packaging) => {
  switch (packaging) {
    case "vacuum":
      return 1.5 // Vacuum packaging extends shelf life
    case "sealed":
      return 1.2 // Sealed containers
    case "plastic":
      return 1.0 // Standard plastic packaging
    case "paper":
      return 0.8 // Paper packaging
    case "none":
      return 0.6 // No packaging
    default:
      return 1.0
  }
}

export const predictExpiry = (foodType, temperature, humidity, packaging) => {
  // Get base expiry days for the food type
  const baseExpiry = baseExpiryDays[foodType] || 5 // Default to 5 days if type not found

  // Calculate factors
  const tempFactor = getTemperatureFactor(temperature)
  const humidityFactor = getHumidityFactor(humidity, foodType)
  const packagingFactor = getPackagingFactor(packaging)

  // Calculate predicted expiry days with some randomness for realism
  const randomFactor = 0.9 + Math.random() * 0.2 // Random factor between 0.9 and 1.1
  const predictedDays = baseExpiry * tempFactor * humidityFactor * packagingFactor * randomFactor

  // Calculate expiry date
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + Math.round(predictedDays))

  return expiryDate.toISOString()
}

// Function to get days remaining until expiry
export const getDaysRemaining = (expiryDate) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Function to get expiry status
export const getExpiryStatus = (expiryDate) => {
  const daysRemaining = getDaysRemaining(expiryDate)

  if (daysRemaining < 0) {
    return "expired"
  } else if (daysRemaining <= 2) {
    return "critical"
  } else if (daysRemaining <= 5) {
    return "warning"
  } else {
    return "good"
  }
}


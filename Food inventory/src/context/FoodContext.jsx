"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { predictExpiry } from "../utils/expiryPredictor"

const FoodContext = createContext()

export const useFoodContext = () => useContext(FoodContext)

export const FoodProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState(() => {
    const savedItems = localStorage.getItem("foodItems")
    return savedItems ? JSON.parse(savedItems) : []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems))
  }, [foodItems])

  const addFoodItem = (foodItem) => {
    setLoading(true)
    try {
      // Calculate expiry date using the ML model simulation
      const expiryDate = predictExpiry(foodItem.foodType, foodItem.temperature, foodItem.humidity, foodItem.packaging)

      const newItem = {
        ...foodItem,
        id: Date.now().toString(),
        expiryDate,
        addedDate: new Date().toISOString(),
      }

      setFoodItems((prev) => [...prev, newItem])
      setLoading(false)
      return newItem
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  const deleteFoodItem = (id) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateFoodItem = (id, updatedData) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              expiryDate: predictExpiry(
                updatedData.foodType || item.foodType,
                updatedData.temperature || item.temperature,
                updatedData.humidity || item.humidity,
                updatedData.packaging || item.packaging,
              ),
            }
          : item,
      ),
    )
  }

  const value = {
    foodItems,
    loading,
    error,
    addFoodItem,
    deleteFoodItem,
    updateFoodItem,
  }

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>
}


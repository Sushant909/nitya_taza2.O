"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFoodContext } from "../context/FoodContext"
import { AlertTriangle } from "lucide-react"

const foodTypes = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "dairy", label: "Dairy" },
  { value: "meat", label: "Meat" },
  { value: "seafood", label: "Seafood" },
  { value: "bakery", label: "Bakery" },
  { value: "prepared", label: "Prepared Meals" },
  { value: "canned", label: "Canned Goods" },
  { value: "frozen", label: "Frozen Foods" },
  { value: "dry", label: "Dry Goods" },
]

const packagingTypes = [
  { value: "vacuum", label: "Vacuum Sealed" },
  { value: "sealed", label: "Sealed Container" },
  { value: "plastic", label: "Plastic Packaging" },
  { value: "paper", label: "Paper Packaging" },
  { value: "none", label: "No Packaging" },
]

const AddFood = () => {
  const navigate = useNavigate()
  const { addFoodItem, loading, error } = useFoodContext()

  const [formData, setFormData] = useState({
    name: "",
    foodType: "fruits",
    temperature: 4, // Default refrigerator temperature
    humidity: 50, // Default humidity
    packaging: "plastic", // Default packaging
    notes: "",
  })

  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "temperature" || name === "humidity" ? Number(value) : value,
    }))

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Food name is required"
    }

    if (formData.temperature < -30 || formData.temperature > 50) {
      errors.temperature = "Temperature must be between -30°C and 50°C"
    }

    if (formData.humidity < 0 || formData.humidity > 100) {
      errors.humidity = "Humidity must be between 0% and 100%"
    }

    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      addFoodItem(formData)
      navigate("/")
    } catch (err) {
      console.error("Error adding food item:", err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Food Item</h1>

      <div className="card">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Food Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${formErrors.name ? "border-red-500" : ""}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter food name"
            />
            {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="foodType" className="form-label">
              Food Category
            </label>
            <select
              id="foodType"
              name="foodType"
              className="form-select"
              value={formData.foodType}
              onChange={handleChange}
            >
              {foodTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="temperature" className="form-label">
                Storage Temperature (°C)
              </label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                className={`form-input ${formErrors.temperature ? "border-red-500" : ""}`}
                value={formData.temperature}
                onChange={handleChange}
                min="-30"
                max="50"
                step="0.5"
              />
              {formErrors.temperature && <p className="text-sm text-red-500 mt-1">{formErrors.temperature}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="humidity" className="form-label">
                Humidity (%)
              </label>
              <input
                type="number"
                id="humidity"
                name="humidity"
                className={`form-input ${formErrors.humidity ? "border-red-500" : ""}`}
                value={formData.humidity}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
              />
              {formErrors.humidity && <p className="text-sm text-red-500 mt-1">{formErrors.humidity}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="packaging" className="form-label">
              Packaging Type
            </label>
            <select
              id="packaging"
              name="packaging"
              className="form-select"
              value={formData.packaging}
              onChange={handleChange}
            >
              {packagingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input min-h-[100px]"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about the food item"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Food Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFood


"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useFoodContext } from "../context/FoodContext"
import { getDaysRemaining, getExpiryStatus } from "../utils/expiryPredictor"
import { Plus, AlertTriangle, CheckCircle, Clock, Trash2, RefreshCw } from "lucide-react"

const Dashboard = () => {
  const { foodItems, deleteFoodItem } = useFoodContext()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("expiryDate")

  const filteredItems = foodItems
    .filter((item) => {
      // Apply search filter
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply status filter
      if (filter === "all") return matchesSearch
      return getExpiryStatus(item.expiryDate) === filter && matchesSearch
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "expiryDate") {
        return new Date(a.expiryDate) - new Date(b.expiryDate)
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "addedDate") {
        return new Date(b.addedDate) - new Date(a.addedDate)
      }
      return 0
    })

  const getStatusIcon = (status) => {
    switch (status) {
      case "expired":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "critical":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "good":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      default:
        return null
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "expired":
        return "bg-red-100 text-red-800"
      case "critical":
        return "bg-orange-100 text-orange-800"
      case "warning":
        return "bg-amber-100 text-amber-800"
      case "good":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Food Inventory</h1>
        <Link to="/add" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Add New Item
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search food items..."
              className="form-input w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Items</option>
              <option value="expired">Expired</option>
              <option value="critical">Critical (≤ 2 days)</option>
              <option value="warning">Warning (≤ 5 days)</option>
              <option value="good">Good</option>
            </select>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="expiryDate">Sort by Expiry Date</option>
              <option value="name">Sort by Name</option>
              <option value="addedDate">Sort by Recently Added</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No food items found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== "all"
                ? "Try changing your search or filter"
                : "Add your first food item to start tracking"}
            </p>
            {!searchTerm && filter === "all" && (
              <Link to="/add" className="btn btn-primary mt-4 inline-flex">
                <Plus className="h-5 w-5" />
                Add Food Item
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Food Item
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expiry Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Storage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const status = getExpiryStatus(item.expiryDate)
                  const daysRemaining = getDaysRemaining(item.expiryDate)

                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{item.foodType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(item.expiryDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(status)}`}
                        >
                          {getStatusIcon(status)}
                          <span className="ml-1 capitalize">
                            {status === "good"
                              ? `${daysRemaining} days left`
                              : status === "expired"
                                ? "Expired"
                                : `${daysRemaining} days left`}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.temperature}°C, {item.humidity}% humidity
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{item.packaging} packaging</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteFoodItem(item.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard


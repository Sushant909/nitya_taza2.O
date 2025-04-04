"use client"

import { useMemo } from "react"
import { useFoodContext } from "../context/FoodContext"
import { getExpiryStatus } from "../utils/expiryPredictor"
import { PieChart, BarChart, LineChart } from "lucide-react"

const Analytics = () => {
  const { foodItems } = useFoodContext()

  const stats = useMemo(() => {
    if (!foodItems.length) return null

    // Calculate expiry statistics
    const expiryStats = foodItems.reduce((acc, item) => {
      const status = getExpiryStatus(item.expiryDate)
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Calculate category statistics
    const categoryStats = foodItems.reduce((acc, item) => {
      acc[item.foodType] = (acc[item.foodType] || 0) + 1
      return acc
    }, {})

    // Calculate average days until expiry by category
    const categoryExpiry = {}
    const today = new Date()

    foodItems.forEach((item) => {
      const expiry = new Date(item.expiryDate)
      const diffTime = expiry - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (!categoryExpiry[item.foodType]) {
        categoryExpiry[item.foodType] = { total: diffDays, count: 1 }
      } else {
        categoryExpiry[item.foodType].total += diffDays
        categoryExpiry[item.foodType].count += 1
      }
    })

    const avgExpiryByCategory = Object.entries(categoryExpiry).map(([category, data]) => ({
      category,
      avgDays: Math.round(data.total / data.count),
    }))

    return {
      total: foodItems.length,
      expiryStats,
      categoryStats,
      avgExpiryByCategory,
    }
  }, [foodItems])

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h1>
        <div className="card">
          <p className="text-gray-500">Add some food items to see analytics</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "expired":
        return "bg-red-500"
      case "critical":
        return "bg-orange-500"
      case "warning":
        return "bg-amber-500"
      case "good":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (index) => {
    const colors = [
      "bg-emerald-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-orange-500",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-emerald-500 mr-2" />
            <h2 className="text-lg font-semibold">Expiry Status</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.expiryStats).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                  <div
                    className={`${getStatusColor(status)} h-4 rounded-full`}
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <div className="min-w-[100px] text-sm flex justify-between">
                  <span className="capitalize">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 text-emerald-500 mr-2" />
            <h2 className="text-lg font-semibold">Food Categories</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.categoryStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([category, count], index) => (
                <div key={category} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div
                      className={`${getCategoryColor(index)} h-4 rounded-full`}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[100px] text-sm flex justify-between">
                    <span className="capitalize">{category}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <LineChart className="h-5 w-5 text-emerald-500 mr-2" />
            <h2 className="text-lg font-semibold">Avg. Days Until Expiry</h2>
          </div>
          <div className="space-y-4">
            {stats.avgExpiryByCategory
              .sort((a, b) => a.avgDays - b.avgDays)
              .slice(0, 5)
              .map(({ category, avgDays }, index) => (
                <div key={category} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div
                      className={`${getCategoryColor(index)} h-4 rounded-full`}
                      style={{ width: `${Math.min((avgDays / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[100px] text-sm flex justify-between">
                    <span className="capitalize">{category}</span>
                    <span className="font-medium">{avgDays} days</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Food Expiry Insights</h2>
        <div className="space-y-4 text-sm">
          <p>
            Based on your current inventory, you have {stats.expiryStats.expired || 0} expired items and{" "}
            {stats.expiryStats.critical || 0} items that will expire within 2 days.
          </p>

          {stats.avgExpiryByCategory.length > 0 && (
            <div>
              <p className="font-medium">Category with shortest shelf life:</p>
              <p>
                {stats.avgExpiryByCategory.sort((a, b) => a.avgDays - b.avgDays)[0].category}(
                {stats.avgExpiryByCategory.sort((a, b) => a.avgDays - b.avgDays)[0].avgDays} days on average)
              </p>
            </div>
          )}

          {stats.avgExpiryByCategory.length > 0 && (
            <div>
              <p className="font-medium">Category with longest shelf life:</p>
              <p>
                {stats.avgExpiryByCategory.sort((a, b) => b.avgDays - a.avgDays)[0].category}(
                {stats.avgExpiryByCategory.sort((a, b) => b.avgDays - a.avgDays)[0].avgDays} days on average)
              </p>
            </div>
          )}

          <div>
            <p className="font-medium">Recommendations:</p>
            <ul className="list-disc pl-5 space-y-1">
              {(stats.expiryStats.expired || 0) > 0 && (
                <li>Dispose of {stats.expiryStats.expired} expired items to maintain food safety.</li>
              )}
              {(stats.expiryStats.critical || 0) > 0 && (
                <li>Prioritize consuming {stats.expiryStats.critical} items that will expire within 2 days.</li>
              )}
              {(stats.expiryStats.warning || 0) > 0 && (
                <li>Plan meals around {stats.expiryStats.warning} items that will expire within 5 days.</li>
              )}
              {Object.entries(stats.categoryStats).length > 3 && (
                <li>You have a diverse inventory across {Object.entries(stats.categoryStats).length} categories.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics


"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, AlertTriangle } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-amber-600 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">FreshTracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/add"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/add")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              Add Food
            </Link>
            <Link
              to="/analytics"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/analytics")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              Analytics
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/add"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/add")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Add Food
            </Link>
            <Link
              to="/analytics"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/analytics")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Analytics
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar


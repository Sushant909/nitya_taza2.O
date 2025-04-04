import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import AddFood from "./pages/AddFood"
import Analytics from "./pages/Analytics"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddFood />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App


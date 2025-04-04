import { Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} FreshTracker. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-emerald-500 transition-colors" aria-label="Github">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-emerald-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-emerald-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


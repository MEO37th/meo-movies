import { Link } from "react-router-dom"
import { FaExclamationTriangle, FaHome } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="text-center">
        <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <FaHome className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound

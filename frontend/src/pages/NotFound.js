import { Link } from "react-router-dom"
import { FaExclamationTriangle, FaHome } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4 text-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary flex items-center">
        <FaHome className="mr-2" /> Back to Home
      </Link>
    </div>
  )
}

export default NotFound

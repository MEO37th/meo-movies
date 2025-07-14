import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LoadingSpinner from "../ui/LoadingSpinner"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />
}

export default PrivateRoute

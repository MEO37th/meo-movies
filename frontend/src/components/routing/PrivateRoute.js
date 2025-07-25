import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute

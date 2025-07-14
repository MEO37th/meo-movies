import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./redux/store"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import PrivateRoute from "./components/routing/PrivateRoute"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MovieDetails from "./pages/MovieDetails"
import Search from "./pages/Search"
import Profile from "./pages/Profile"
import Favorites from "./pages/Favorites"
import Watchlist from "./pages/Watchlist"
import NotFound from "./pages/NotFound"

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <PrivateRoute>
                    <Watchlist />
                  </PrivateRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </Provider>
  )
}

export default App

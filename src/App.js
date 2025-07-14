"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import store from "./store/store"
import { loadUser } from "./store/slices/authSlice"
import ErrorBoundary from "./components/ErrorBoundary"

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

function AppContent() {
  useEffect(() => {
    // Load user on app start
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
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
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="bg-gray-800 text-white"
          />
        </div>
      </ErrorBoundary>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App

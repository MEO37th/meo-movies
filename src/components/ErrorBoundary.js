"use client"

import React from "react"
import { Link } from "react-router-dom"
import { FaExclamationTriangle } from "react-icons/fa"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
          <div className="text-center max-w-md">
            <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              We're sorry, but there was an error loading this page. Please try refreshing or go back to the home page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              <Link to="/" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

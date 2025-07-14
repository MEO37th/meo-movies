import { Link } from "react-router-dom"
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">MovieApp</h3>
            <p className="mb-4">
              Discover the latest movies, create your watchlist, and keep track of your favorite films.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-white">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} MovieApp. All rights reserved.</p>
          <p className="mt-2 text-sm">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

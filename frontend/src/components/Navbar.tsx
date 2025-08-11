import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Renders the main site-wide navigation bar.
 */
const Navbar = () => {
  const { isAuthenticated } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0  flex justify-between p-5 font-sans font-medium border-b border-gray-200 z-50 bg-white">
      <div>
        <Link to="/" className="text-xl">
          ShinKanji
        </Link>
      </div>
      <div>
        <ul className="flex space-x-10 content-center">
          <li>
            <Link to="/kanjis"> Kanjis </Link>
          </li>
          <li>
            <Link to="/deck"> My decks </Link>
          </li>
          <li>
            <Link to="/quiz"> Quiz Zone </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

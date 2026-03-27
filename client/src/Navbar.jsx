import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">EduMy</Link>

      <div className="flex items-center gap-6 text-sm">
        <Link to="/courses" className="text-gray-600 hover:text-indigo-600">Courses</Link>

        {user ? (
          <>
            {user.role === 'Student' && (
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">My Learning</Link>
            )}
            {user.role === 'Lecturer' && (
              <Link to="/my-courses" className="text-gray-600 hover:text-indigo-600">My Courses</Link>
            )}
            {user.role === 'Admin' && (
              <>
                <Link to="/admin/users" className="text-gray-600 hover:text-indigo-600">Users</Link>
                <Link to="/admin/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              </>
            )}
            <Link to="/profile" className="text-gray-600 hover:text-indigo-600">{user.firstName}</Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

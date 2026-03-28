import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const link = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname.startsWith(to) ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">EduMy</Link>

      <div className="flex items-center gap-6">
        {link('/courses', 'Courses')}

        {user ? (
          <>
            {user.role === 'Student' && link('/dashboard', 'My Learning')}
            {user.role === 'Lecturer' && link('/my-courses', 'My Courses')}
            {user.role === 'Admin' && (
              <>
                {link('/admin/users', 'Users')}
                {link('/admin/categories', 'Categories')}
              </>
            )}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <Link to="/profile" className={`text-sm font-medium ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}>
                {user.firstName}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-indigo-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-indigo-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Login</Link>
            <Link to="/register" className="rounded-lg bg-indigo-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-indigo-500 transition-colors">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

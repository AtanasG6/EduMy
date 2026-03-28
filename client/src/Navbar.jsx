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

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive(to) ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-lg font-bold text-gray-900 tracking-tight">
        Edu<span className="text-indigo-600">My</span>
      </Link>

      <div className="flex items-center gap-7">
        {navLink('/courses', 'Courses')}
        {user?.role === 'Student' && navLink('/dashboard', 'My Learning')}
        {user?.role === 'Lecturer' && navLink('/my-courses', 'My Courses')}
        {user?.role === 'Admin' && navLink('/admin/users', 'Users')}
        {user?.role === 'Admin' && navLink('/admin/categories', 'Categories')}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/profile"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname === '/profile' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                {user.firstName?.[0]?.toUpperCase()}
              </span>
              {user.firstName}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 text-white text-sm font-semibold px-4 py-2 hover:bg-indigo-500 transition-colors"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

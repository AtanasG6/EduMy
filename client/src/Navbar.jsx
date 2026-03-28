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
        isActive(to) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-7 h-7 rounded-lg bg-gray-950 flex items-center justify-center">
          <span className="text-white text-xs font-black tracking-tighter">E</span>
        </div>
        <span className="text-base font-bold text-gray-950 tracking-tight">EduMy</span>
      </Link>

      <div className="flex items-center gap-6">
        {navLink('/courses', 'Courses')}

        {user ? (
          <>
            {user.role === 'Student' && navLink('/dashboard', 'My Learning')}
            {user.role === 'Lecturer' && navLink('/my-courses', 'My Courses')}
            {user.role === 'Admin' && (
              <>
                {navLink('/admin/users', 'Users')}
                {navLink('/admin/categories', 'Categories')}
              </>
            )}
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/profile"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname === '/profile' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
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
              className="rounded-xl bg-gray-950 text-white text-sm font-semibold px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

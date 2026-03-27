import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Learn something new today</h1>
      <p className="text-lg text-gray-500 mb-8">
        Thousands of courses taught by real instructors.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          to="/courses"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Browse courses
        </Link>
        {!user && (
          <Link
            to="/register"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Sign up free
          </Link>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/enrollments')
        setEnrollments(res.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.firstName}!</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">You have no courses yet.</p>
          <Link
            to="/courses"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {enrollments.map(enrollment => (
            <Link
              key={enrollment.id}
              to={`/learn/${enrollment.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-gray-900 mb-1">{enrollment.courseTitle}</h2>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${enrollment.progressPercent ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{enrollment.progressPercent ?? 0}% complete</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

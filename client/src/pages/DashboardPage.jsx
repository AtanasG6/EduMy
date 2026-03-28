import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/enrollments')
      .then(r => setEnrollments(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-2 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-gray-500 mb-5">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="inline-block rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
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
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl shrink-0">
                  📚
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {enrollment.courseTitle}
                  </h2>
                  {enrollment.isCompleted && (
                    <span className="inline-block mt-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{enrollment.progressPercent ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${enrollment.progressPercent ?? 0}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

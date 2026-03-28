import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { Icon, faArrowRight, faBook, faCircleCheck } from '../icons'
import CourseThumbnail from '../CourseThumbnail'

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

  const inProgress = enrollments.filter(e => !e.isCompleted)
  const completed = enrollments.filter(e => e.isCompleted)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        {enrollments.length > 0 && (
          <div className="flex gap-3">
            <div className="border border-gray-200 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{enrollments.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Enrolled</div>
            </div>
            <div className="border border-gray-200 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-green-600">{completed.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Completed</div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-28 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-2 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <Icon icon={faBook} className="text-2xl text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">No courses yet</h3>
          <p className="text-sm text-gray-500 mb-6">Enroll in your first course and start learning today.</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
          >
            Browse courses <Icon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {inProgress.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">In progress</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inProgress.map(e => <EnrollmentCard key={e.id} enrollment={e} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Completed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {completed.map(e => <EnrollmentCard key={e.id} enrollment={e} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EnrollmentCard({ enrollment }) {
  const progress = enrollment.progressPercent ?? 0
  return (
    <Link
      to={`/learn/${enrollment.id}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <CourseThumbnail id={enrollment.courseId} title={enrollment.courseTitle} className="h-28" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug text-sm">
            {enrollment.courseTitle}
          </h2>
          {enrollment.isCompleted && (
            <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
              <Icon icon={faCircleCheck} className="text-[10px]" />Done
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{progress}% complete</span>
            <span className="text-indigo-600 font-medium flex items-center gap-1">
              Continue <Icon icon={faArrowRight} className="text-[9px]" />
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${enrollment.isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Dashboard</p>
            <h1 className="text-4xl font-black tracking-tight text-gray-950">
              Welcome back, {user?.firstName}.
            </h1>
          </div>
          {enrollments.length > 0 && (
            <div className="flex gap-3 text-center">
              <div className="border border-gray-100 rounded-2xl px-5 py-3 min-w-[72px]">
                <div className="text-2xl font-black text-gray-950 tabular-nums">{enrollments.length}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Enrolled</div>
              </div>
              <div className="border border-gray-100 rounded-2xl px-5 py-3 min-w-[72px]">
                <div className="text-2xl font-black text-gray-950 tabular-nums">{completed.length}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Done</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-2 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-28 border border-dashed border-gray-200 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-5">
              <Icon icon={faBook} className="text-2xl text-gray-300" />
            </div>
            <h3 className="font-black text-gray-950 tracking-tight mb-2">No courses yet</h3>
            <p className="text-sm text-gray-400 mb-7">Enroll in your first course and start learning today.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 text-white px-6 py-3 text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Browse courses
              <Icon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {inProgress.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">In progress</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inProgress.map(e => <EnrollmentCard key={e.id} enrollment={e} />)}
                </div>
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Completed</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completed.map(e => <EnrollmentCard key={e.id} enrollment={e} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EnrollmentCard({ enrollment }) {
  const progress = enrollment.progressPercent ?? 0
  return (
    <Link
      to={`/learn/${enrollment.id}`}
      className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-200"
    >
      <CourseThumbnail id={enrollment.courseId} title={enrollment.courseTitle} className="h-28" />
      <div className="p-5 bg-white">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="font-bold text-gray-950 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug tracking-tight text-sm">
            {enrollment.courseTitle}
          </h2>
          {enrollment.isCompleted && (
            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full uppercase tracking-wide">
              <Icon icon={faCircleCheck} className="text-[9px]" />
              Done
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-400 font-medium">
            <span>{progress}% complete</span>
            <span className="flex items-center gap-1 text-indigo-600 group-hover:gap-2 transition-all">
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

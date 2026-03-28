import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { Icon, faPlus, faPen, faTrash, faUsers, faGraduationCap } from '../icons'
import ConfirmModal from '../ConfirmModal'
import CourseThumbnail from '../CourseThumbnail'

const STATUS_BADGE = {
  Published: 'bg-green-50 text-green-700 border-green-100',
  Draft: 'bg-amber-50 text-amber-700 border-amber-100',
  Archived: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    api.get('/courses/my').then(r => setCourses(r.data.data ?? [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    if (!confirm) return
    setConfirmLoading(true)
    try {
      await api.delete(`/courses/${confirm.courseId}`)
      setCourses(courses.filter(c => c.id !== confirm.courseId))
      setConfirm(null)
    } catch {
      // ignore
    } finally {
      setConfirmLoading(false)
    }
  }

  async function handlePublish(id) {
    try {
      await api.post(`/courses/${id}/publish`)
      setCourses(courses.map(c => c.id === id ? { ...c, status: 'Published' } : c))
    } catch { /* ignore */ }
  }

  async function handleArchive(id) {
    try {
      await api.post(`/courses/${id}/archive`)
      setCourses(courses.map(c => c.id === id ? { ...c, status: 'Archived' } : c))
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {confirm && (
        <ConfirmModal
          title="Delete course"
          message={`Delete "${confirm.title}"? All modules, lectures, and enrollments will be removed.`}
          confirmLabel="Delete"
          loading={confirmLoading}
          onConfirm={handleDelete}
          onClose={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          {courses.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {courses.filter(c => c.status === 'Published').length} published · {courses.filter(c => c.status === 'Draft').length} drafts
            </p>
          )}
        </div>
        <Link
          to="/my-courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          <Icon icon={faPlus} className="text-xs" />New course
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-100" />
              <div className="p-5 space-y-2.5">
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <Icon icon={faGraduationCap} className="text-2xl text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">No courses yet</h3>
          <p className="text-sm text-gray-500 mb-6">Create your first course and start teaching.</p>
          <Link
            to="/my-courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
          >
            <Icon icon={faPlus} className="text-xs" />Create first course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200">
              <CourseThumbnail id={course.id} title={course.title} className="h-32" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900 line-clamp-1 text-sm flex-1">{course.title}</h2>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[course.status] ?? ''}`}>
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <Icon icon={faUsers} className="text-[10px]" />{course.enrollmentCount} students
                  <span className="text-gray-200">·</span>
                  {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/my-courses/${course.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <Icon icon={faPen} className="text-[9px]" />Edit
                  </Link>
                  {course.status === 'Draft' && (
                    <button onClick={() => handlePublish(course.id)} className="flex-1 rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50 transition-colors">
                      Publish
                    </button>
                  )}
                  {course.status === 'Published' && (
                    <button onClick={() => handleArchive(course.id)} className="flex-1 rounded-lg border border-amber-200 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors">
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => setConfirm({ courseId: course.id, title: course.title })}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <Icon icon={faTrash} className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { Icon, faArrowRight, faPlay, faBook, faGraduationCap } from '../icons'
import CourseThumbnail from '../CourseThumbnail'

export default function HomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/courses', { params: { page: 1, pageSize: 6 } }).then(r => setCourses(r.data.data?.items ?? [])).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data.data ?? [])).catch(() => {})
  }, [])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gray-950 text-white px-6 pt-24 pb-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f120, transparent 40%), radial-gradient(circle at 80% 20%, #8b5cf615, transparent 40%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400 mb-10 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Expert-led online learning
          </div>

          <h1 className="text-6xl font-black tracking-tight leading-[1.05] mb-6">
            The skills you want.<br />
            <span className="text-indigo-400">Free to start.</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Courses built by practitioners. Video lectures, quizzes, and progress tracking — all in one place.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-950 px-7 py-3.5 text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              Browse courses
              <Icon icon={faArrowRight} className="text-xs" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 text-white px-7 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Create account
              </Link>
            )}
          </div>

          {/* Stats */}
          {(courses.length > 0 || categories.length > 0) && (
            <div className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-black text-white tabular-nums">10+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">Courses</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-white tabular-nums">{categories.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">Categories</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">Free</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">To enroll</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Categories</p>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">What do you want to learn?</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/courses?categoryId=${cat.id}`}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-950 hover:text-gray-950 hover:bg-gray-50 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Courses */}
      {courses.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Featured</p>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">Popular courses</h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
            >
              View all <Icon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-200"
              >
                <CourseThumbnail id={course.id} title={course.title} className="h-40" />
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{course.categoryName}</p>
                  <h3 className="font-bold text-gray-950 mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">by {course.lecturerName}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm font-black text-gray-950">
                      {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <span className="text-xs text-gray-400">{course.enrollmentCount} students</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">How it works</p>
            <h2 className="text-3xl font-black text-gray-950 tracking-tight">Three steps to mastery</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { num: '01', title: 'Find a course', desc: 'Browse our library of expert-built courses across programming, design, and more.' },
              { num: '02', title: 'Learn and practice', desc: 'Watch video lectures, answer quiz questions, and track your progress as you go.' },
              { num: '03', title: 'Master your craft', desc: 'Complete courses and build the hands-on skills that matter to employers.' },
            ].map(item => (
              <div key={item.num} className="flex flex-col">
                <span className="text-xs font-black text-gray-300 tracking-widest mb-4">{item.num}</span>
                <h3 className="font-black text-gray-950 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

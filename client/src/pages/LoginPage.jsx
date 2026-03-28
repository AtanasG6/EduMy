import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors'

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
            Edu<span className="text-indigo-600">My</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue learning</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7">
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create one free
            </Link>
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {[
            { label: 'Admin', email: 'admin@edumy.com', pass: 'Admin123!', cls: 'border-rose-100 bg-rose-50 hover:border-rose-300', badge: 'text-rose-600 bg-rose-100' },
            { label: 'Lecturer', email: 'lecturer@edumy.com', pass: 'Lecturer123!', cls: 'border-violet-100 bg-violet-50 hover:border-violet-300', badge: 'text-violet-600 bg-violet-100' },
            { label: 'Student', email: 'student@edumy.com', pass: 'Student123!', cls: 'border-indigo-100 bg-indigo-50 hover:border-indigo-300', badge: 'text-indigo-600 bg-indigo-100' },
          ].map(({ label, email, pass, cls, badge }) => (
            <button
              key={label}
              type="button"
              onClick={() => setForm({ email, password: pass })}
              className={`w-full flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors ${cls}`}
            >
              <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 w-16 text-center ${badge}`}>
                {label}
              </span>
              <span className="text-xs text-gray-500 font-mono">{email}</span>
            </button>
          ))}</div>
      </div>
    </div>
  )
}

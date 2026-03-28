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

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <span className="text-white text-sm font-black">E</span>
            </div>
            <span className="text-white text-lg font-black tracking-tight">EduMy</span>
          </Link>
          <p className="mt-6 text-2xl font-black text-white tracking-tight">Welcome back</p>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue learning</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-gray-200 transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Demo — admin@edumy.com / Admin123! &nbsp;·&nbsp; student@edumy.com / Student123!
        </p>
      </div>
    </div>
  )
}

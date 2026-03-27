import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'Student' })
  const [diplomaFile, setDiplomaFile] = useState(null)
  const [diplomaStatus, setDiplomaStatus] = useState(null) // null | 'checking' | 'ok' | 'fail'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDiplomaChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setDiplomaFile(file)
    setDiplomaStatus('checking')
    setError('')

    const data = new FormData()
    data.append('file', file)
    try {
      const res = await api.post('/diploma/verify', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const result = res.data.data
      setDiplomaStatus(result.isValid ? 'ok' : 'fail')
      if (!result.isValid) setError(result.message)
    } catch {
      setDiplomaStatus('fail')
      setError('Diploma verification failed. Please try again.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.role === 'Lecturer' && diplomaStatus !== 'ok') {
      setError('Please upload a valid diploma to register as a Lecturer.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.data.user, res.data.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create account</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I want to</label>
            <select
              value={form.role}
              onChange={e => { setForm({ ...form, role: e.target.value }); setDiplomaStatus(null); setDiplomaFile(null) }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Student">Learn (Student)</option>
              <option value="Lecturer">Teach (Lecturer)</option>
            </select>
          </div>

          {form.role === 'Lecturer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diploma / Certificate
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Upload an image of your diploma or academic certificate for verification.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleDiplomaChange}
                required
                className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {diplomaStatus === 'checking' && (
                <p className="text-xs text-gray-500 mt-2">Verifying with AI...</p>
              )}
              {diplomaStatus === 'ok' && (
                <p className="text-xs text-green-600 mt-2">✓ Diploma verified</p>
              )}
              {diplomaStatus === 'fail' && (
                <p className="text-xs text-red-500 mt-2">✗ Could not verify diploma</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || diplomaStatus === 'checking'}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

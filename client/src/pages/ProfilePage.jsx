import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import api from '../api'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', bio: '', specialization: '', yearsOfExperience: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(r => {
      const u = r.data.data
      setForm({
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        bio: u.bio ?? '',
        specialization: u.specialization ?? '',
        yearsOfExperience: u.yearsOfExperience ?? '',
      })
    }).catch(() => {})
  }, [])

  async function handleProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await api.put('/users/me', form)
      const updated = res.data.data
      const token = localStorage.getItem('token')
      login({ ...updated, token })
      setMessage('Profile saved.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePassword(e) {
    e.preventDefault()
    setPwMessage('')
    try {
      await api.put('/users/me/password', pwForm)
      setPwForm({ currentPassword: '', newPassword: '' })
      setPwMessage('Password changed.')
    } catch (err) {
      setPwMessage(err.response?.data?.message || 'Failed to change password.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Personal info</h2>
        {message && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {user?.role === 'Lecturer' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of experience</label>
                <input
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <span className="text-xs text-gray-400">Role: {user?.role}</span>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Change password</h2>
        {pwMessage && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${pwMessage.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {pwMessage}
          </div>
        )}
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-gray-800 text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Change password
          </button>
        </form>
      </div>
    </div>
  )
}

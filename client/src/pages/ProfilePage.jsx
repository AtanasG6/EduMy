import { useState } from 'react'
import { useAuth } from '../AuthContext'
import api from '../api'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await api.put('/users/me', form)
      login(res.data.data, localStorage.getItem('token'))
      setMessage('Profile updated.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update.')
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
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* Profile info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Personal info</h2>
        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Change password</h2>
        {pwMessage && <p className="text-sm text-indigo-600 mb-3">{pwMessage}</p>}
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Change password
          </button>
        </form>
      </div>
    </div>
  )
}

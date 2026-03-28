import { useState, useEffect } from 'react'
import api from '../api'

const ROLE_COLORS = { Admin: 'bg-purple-100 text-purple-700', Lecturer: 'bg-blue-100 text-blue-700', Student: 'bg-gray-100 text-gray-600' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleBlock(id) {
    try {
      await api.put(`/users/${id}/block`)
      setUsers(users.map(u => u.id === id ? { ...u, isBlocked: true } : u))
    } catch {
      // ignore
    }
  }

  async function handleUnblock(id) {
    try {
      await api.put(`/users/${id}/unblock`)
      setUsers(users.map(u => u.id === id ? { ...u, isBlocked: false } : u))
    } catch {
      // ignore
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user permanently?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch {
      // ignore
    }
  }

  const filtered = users.filter(u =>
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>

      <input
        type="text"
        placeholder="Search users…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 rounded-lg border border-gray-300 px-3.5 py-2 text-sm w-64 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-5 py-3.5 text-left">Name</th>
                <th className="px-5 py-3.5 text-left">Email</th>
                <th className="px-5 py-3.5 text-left">Role</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-5 py-4 text-gray-500">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {user.isBlocked
                        ? <button onClick={() => handleUnblock(user.id)} className="text-indigo-600 hover:underline">Unblock</button>
                        : <button onClick={() => handleBlock(user.id)} className="text-yellow-600 hover:underline">Block</button>
                      }
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">No users found.</p>
          )}
        </div>
      )}
    </div>
  )
}

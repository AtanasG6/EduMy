import { useState, useEffect } from 'react'
import api from '../api'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/users')
        setUsers(res.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleBlock(id) {
    try {
      await api.post(`/users/${id}/block`)
      setUsers(users.map(u => u.id === id ? { ...u, isBlocked: true } : u))
    } catch {
      // ignore
    }
  }

  async function handleUnblock(id) {
    try {
      await api.post(`/users/${id}/unblock`)
      setUsers(users.map(u => u.id === id ? { ...u, isBlocked: false } : u))
    } catch {
      // ignore
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    {user.isBlocked ? (
                      <button onClick={() => handleUnblock(user.id)} className="text-indigo-600 hover:underline">
                        Unblock
                      </button>
                    ) : (
                      <button onClick={() => handleBlock(user.id)} className="text-yellow-600 hover:underline">
                        Block
                      </button>
                    )}
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { API_URL } from '../config'

export default function AddUserModal({ organizationId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', role: '' })
  const [showRoles, setShowRoles] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch(`${API_URL}/api/organizations/${organizationId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name of the user</label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Choose user role</label>
            <button
              type="button"
              onClick={() => setShowRoles(!showRoles)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {formData.role || 'Select an option'}
            </button>
            {showRoles && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, role: 'Admin' }); setShowRoles(false) }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, role: 'Co-ordinator' }); setShowRoles(false) }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50"
                >
                  Co-ordinator
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

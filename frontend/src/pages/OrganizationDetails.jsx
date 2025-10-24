import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AddUserModal from '../components/AddUserModal'
import EditUserModal from '../components/EditUserModal'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import Toast from '../components/Toast'

export default function OrganizationDetails() {
  const { id } = useParams()
  const [organization, setOrganization] = useState(null)
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('basic')
  const [showUserModal, setShowUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchOrganization()
    fetchUsers()
  }, [id])

  const fetchOrganization = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:3001/api/organizations/${id}`)
      if (!res.ok) throw new Error('Failed to fetch organization')
      const data = await res.json()
      setOrganization(data)
      setFormData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/organizations/${id}/users`)
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`http://localhost:3001/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to save organization')
      setIsEditing(false)
      setToast({ message: 'Organization updated successfully', type: 'success' })
      fetchOrganization()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${userId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete user')
        setToast({ message: 'User deleted successfully', type: 'success' })
        fetchUsers()
      } catch (err) {
        setToast({ message: err.message, type: 'error' })
      }
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowEditUserModal(true)
  }

  const handleChangeStatus = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:3001/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update status')
      setShowStatusMenu(false)
      setToast({ message: 'Status updated successfully', type: 'success' })
      fetchOrganization()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const getRoleBadgeColor = (role) => {
    return role === 'Admin' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message="Organization not found" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ErrorAlert message={error} onClose={() => setError(null)} />
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">🏠</Link>
        <span>&gt;</span>
        <Link to="/organizations" className="hover:text-gray-700">Manage B2B organizations</Link>
        <span>&gt;</span>
        <span>Organization details</span>
      </nav>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="relative group">
                <div className="w-24 h-24 bg-orange-700 rounded-lg flex items-center justify-center text-4xl overflow-hidden">
                  {organization.logo && organization.logo.startsWith('data:') ? (
                    <img src={organization.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : formData.logo && formData.logo.startsWith('data:') ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{organization.logo || '🏢'}</span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{organization.name}</h1>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {organization.email}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {organization.phone}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={`http://${organization.website}`} className="text-purple-600 hover:underline">{organization.website}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${organization.status === 'Active' ? 'bg-green-100 text-green-800' :
                  organization.status === 'Blocked' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {organization.status}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Change status
                </button>
                {showStatusMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleChangeStatus('Active')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-green-600"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleChangeStatus('Blocked')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600"
                    >
                      Blocked
                    </button>
                    <button
                      onClick={() => handleChangeStatus('Inactive')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600"
                    >
                      Inactive
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-3 text-sm font-medium border-b-2 ${activeTab === 'basic' ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent'
                }`}
            >
              Basic details
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 text-sm font-medium border-b-2 ${activeTab === 'users' ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent'
                }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'basic' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-purple-600 hover:text-purple-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Organization details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Organization name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Organization SLUG</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Contact details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Primary Admin name</label>
                  <input
                    type="text"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Primary Admin Mail-id</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Support Email ID</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone no</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Alternative phone no</label>
                    <input
                      type="text"
                      value={formData.alt_phone || ''}
                      onChange={(e) => setFormData({ ...formData, alt_phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Maximum Allowed Coordinators</h3>
              <select
                value={formData.max_coordinators || 5}
                onChange={(e) => setFormData({ ...formData, max_coordinators: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
              >
                <option value="5">Upto 5 Coordinators</option>
                <option value="10">Upto 10 Coordinators</option>
                <option value="20">Upto 20 Coordinators</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Timezone</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Common name</label>
                  <select
                    value={formData.timezone || 'India Standard Time'}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  >
                    <option>India Standard Time</option>
                    <option>Eastern Standard Time</option>
                    <option>Pacific Standard Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Region</label>
                  <select
                    value={formData.region || 'Asia/Colombo'}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
                  >
                    <option>Asia/Colombo</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Language</h3>
              <select
                value={formData.language || 'English'}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Official website URL</h3>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm disabled:opacity-75"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => { setIsEditing(false); setFormData(organization) }}
                  disabled={saving}
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 flex items-center"
            >
              <span className="mr-1">+</span> Add user
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleEditUser(user)} className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showUserModal && (
        <AddUserModal
          organizationId={id}
          onClose={() => setShowUserModal(false)}
          onSuccess={() => {
            setShowUserModal(false)
            setToast({ message: 'User added successfully', type: 'success' })
            fetchUsers()
          }}
        />
      )}

      {showEditUserModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setShowEditUserModal(false)
            setEditingUser(null)
          }}
          onSuccess={() => {
            setShowEditUserModal(false)
            setEditingUser(null)
            setToast({ message: 'User updated successfully', type: 'success' })
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}

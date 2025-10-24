import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AddOrganizationModal from '../components/AddOrganizationModal'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import Toast from '../components/Toast'

export default function Organizations() {
  const [organizations, setOrganizations] = useState([])
  const [filteredOrgs, setFilteredOrgs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchOrganizations()
  }, [])

  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      const filtered = organizations.filter(org => 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOrgs(filtered)
    } else {
      setFilteredOrgs(organizations)
    }
  }, [searchParams, organizations])

  const fetchOrganizations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:3001/api/organizations')
      if (!res.ok) throw new Error('Failed to fetch organizations')
      const data = await res.json()
      setOrganizations(data)
      setFilteredOrgs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        const res = await fetch(`http://localhost:3001/api/organizations/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete organization')
        setToast({ message: 'Organization deleted successfully', type: 'success' })
        fetchOrganizations()
      } catch (err) {
        setToast({ message: err.message, type: 'error' })
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Blocked': return 'bg-red-100 text-red-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">🏠</Link>
        <span>&gt;</span>
        <span>Manage B2B organizations</span>
      </nav>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">B2B organizations</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 flex items-center"
          >
            <span className="mr-1">+</span> Add organization
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrgs.map((org, index) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-orange-700 mr-3">
                        {org.logo && org.logo.startsWith('data:') ? (
                          <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{org.logo || '🏢'}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-900">{org.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{org.pending_requests} pending requests</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Link to={`/organizations/${org.id}`} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button onClick={() => handleDelete(org.id)} className="text-gray-400 hover:text-red-600">
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

      {showModal && (
        <AddOrganizationModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            setToast({ message: 'Organization created successfully', type: 'success' })
            fetchOrganizations()
          }}
        />
      )}
    </div>
  )
}

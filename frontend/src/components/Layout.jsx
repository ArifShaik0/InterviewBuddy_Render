import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Layout({ children }) {
  const location = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="border-2 border-black px-3 py-1 font-bold">LOGO</div>
              <nav className="flex space-x-8">
                <Link
                  to="/"
                  className={`text-sm ${
                    location.pathname === '/' ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/organizations"
                  className={`text-sm border-b-2 ${
                    location.pathname.includes('/organizations')
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 border-transparent'
                  }`}
                >
                  Manage B2B organizations
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {showSearch && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                    <input
                      type="text"
                      placeholder="Search organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    {searchQuery && (
                      <div className="mt-2">
                        <Link 
                          to={`/organizations?search=${searchQuery}`}
                          onClick={() => { setShowSearch(false); setSearchQuery('') }}
                          className="block px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded"
                        >
                          Search for "{searchQuery}"
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center hover:bg-purple-300"
                >
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                    <p className="text-sm text-gray-700">This is your profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

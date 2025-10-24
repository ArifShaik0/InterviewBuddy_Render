import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Organizations from './pages/Organizations'
import OrganizationDetails from './pages/OrganizationDetails'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/:id" element={<OrganizationDetails />} />
      </Routes>
    </Layout>
  )
}

export default App

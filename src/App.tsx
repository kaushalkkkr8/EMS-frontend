// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import ManagerDashboard from './pages/ManagerDashboard'
import EngineerDashboard from './pages/EngineerDashboard'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { AssignmentProvider } from './context/AssignmentContext'
import { EngineerProvider } from './context/EngineerContext'

function App() {
  return (

    <Router>
      <AuthProvider>
        <ProjectProvider>
          <AssignmentProvider>
            <EngineerProvider>

              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
              </Routes>
            </EngineerProvider>
          </AssignmentProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

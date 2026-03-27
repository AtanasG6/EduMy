import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import DashboardPage from './pages/DashboardPage'
import LearnPage from './pages/LearnPage'
import ProfilePage from './pages/ProfilePage'
import MyCoursesPage from './pages/MyCoursesPage'
import CreateCoursePage from './pages/CreateCoursePage'
import EditCoursePage from './pages/EditCoursePage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Any logged-in user */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/learn/:enrollmentId" element={<PrivateRoute><LearnPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        {/* Lecturer */}
        <Route path="/my-courses" element={<PrivateRoute roles={['Lecturer']}><MyCoursesPage /></PrivateRoute>} />
        <Route path="/my-courses/new" element={<PrivateRoute roles={['Lecturer']}><CreateCoursePage /></PrivateRoute>} />
        <Route path="/my-courses/:id/edit" element={<PrivateRoute roles={['Lecturer']}><EditCoursePage /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/users" element={<PrivateRoute roles={['Admin']}><AdminUsersPage /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute roles={['Admin']}><AdminCategoriesPage /></PrivateRoute>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

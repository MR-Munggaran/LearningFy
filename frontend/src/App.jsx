import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Course from './pages/Course'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import Category from './pages/Category'
import SignUp from './pages/SignUp'
import DetailCourse from './pages/DetailCourse'
import LearningPage from './pages/LearningPage'
import DashboardLayout from './pages/Dashboard'
import MyCourses from './pages/Dashboard/MyCourse'
import Landing from './pages/Dashboard/Landing'
import ProgressEnrollment from './pages/Dashboard/ProgressEnrollment'
import ManageCourse from './pages/Dashboard/ManageCourse'
import ManageModule from './pages/Dashboard/ManageModule'
import ManageLesson from './pages/Dashboard/ManageLesson'
import ManageUsers from './pages/Dashboard/ManageUser'
import ManageCategory from './pages/Dashboard/ManageCategory'
import Profile from './pages/Profile'

import { useAuthContext } from "./context/AuthContext"
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import ManageTags from './pages/Dashboard/ManageTags'
import CourseForm from './pages/Dashboard/CourseForm'
import MyModule from './pages/Dashboard/MyModule'

const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const {authUser} = useAuthContext();

  return (
    <>
      {!isDashboard && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={authUser ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />
        <Route path='/' element={<Home />} />
        <Route path='/course' element={<Course />} />
        <Route path='/course/:id' element={<DetailCourse />} />
        <Route path='/category' element={<Category />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* umum (semua role yang login) */}
          <Route index element={<Landing />} />
          <Route path="student/courses" element={
            <ProtectedRoute roles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          } />
          <Route path="student/progress" element={
            <ProtectedRoute roles={["student"]}>
              <ProgressEnrollment />
            </ProtectedRoute>
          } />
          <Route path="student/modules/:id" element={
            <ProtectedRoute roles={["student"]}>
              <MyModule />
            </ProtectedRoute>
          } />
          <Route path="student/player" element={
            <ProtectedRoute roles={["student"]}>
              <LearningPage />
            </ProtectedRoute>
          } />

          {/* khusus instructor */}
          <Route path="instructor/courses" element={
            <ProtectedRoute roles={["instructor"]}>
              <ManageCourse />
            </ProtectedRoute>
          } />
          <Route path="instructor/modules/:id" element={
            <ProtectedRoute roles={["instructor"]}>
              <ManageModule />
            </ProtectedRoute>
          } />
          <Route path="instructor/lessons" element={
            <ProtectedRoute roles={["instructor"]}>
              <ManageLesson />
            </ProtectedRoute>
          } />

          {/* khusus admin */}
          <Route path="admin/users" element={
            <ProtectedRoute roles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="admin/categories" element={
            <ProtectedRoute roles={["admin"]}>
              <ManageCategory />
            </ProtectedRoute>
          } />

          <Route path="admin/tags" element={
            <ProtectedRoute roles={["admin"]}>
              <ManageTags />
            </ProtectedRoute>
          } />

          <Route path="instructor/courses/new" element={
            <ProtectedRoute roles={["instructor"]}>
              <CourseForm />
            </ProtectedRoute>
          } />
          <Route path="instructor/courses/:id/edit" element={
            <ProtectedRoute roles={["instructor"]}>
              <CourseForm  />
            </ProtectedRoute>
          } />

          {/* profile bisa diakses semua yang login */}
          <Route path="profilMe" element={<Profile />} />
        </Route>

      </Routes>
      <Toaster/>

      {!isDashboard && <Footer />}
    </>
  )
}

export default App

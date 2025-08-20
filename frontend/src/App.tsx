
import { lazy } from 'react';
import '@/App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import PrivateRoute from '@/context/PrivateRoutes';
import PublicRoute from '@/context/PublicRoutes';
import Success from '@/pages/success';
import Cancel from '@/pages/cancel';
const DashboardStudent = lazy(() => import('@/pages/student/dashboard'));
const DashboardTeacher = lazy(() => import('@/pages/teacher/dashboard'));
const Home = lazy(() => import('@/pages/home'));
const Students = lazy(() => import('@/pages/admin/students'));
const Teachers = lazy(() => import('@/pages/admin/teachers'));
const Login = lazy(() => import('@/pages/login'));
const AdminLogin = lazy(() => import('@/pages/admin/login'))
const Signup = lazy(() => import('@/pages/signup'));
const Profile = lazy(() => import('@/pages/profile'));
const NotFound = lazy(() => import('@/pages/notfound'));
const ForgotPassword = lazy(() => import('@/pages/forgotpassword'));
const ResetPassword = lazy(() => import('@/pages/resetPassword'));
const Users = lazy(() => import('@/pages/users'));
const Courses = lazy(() => import('@/pages/courses'));
const CoursesPage = lazy(() => import('@/pages/admin/coursesPage'));
const Subscription = lazy(() => import('@/pages/subscription'));
const ApprovalPending = lazy(() => import('@/pages/approvalpending'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fallback Route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
        {/* Admin Private Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute>
              <Students />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <PrivateRoute>
              <Teachers />
            </PrivateRoute>
          }
        />
        {/* Student & Teacher Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute>
              <DashboardStudent />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute>
              <DashboardTeacher />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <PrivateRoute>
              <CoursesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <PrivateRoute>
              <Subscription />
            </PrivateRoute>
          }
        />
        <Route
          path="/success"
          element={
            <PrivateRoute>
              <Success />
            </PrivateRoute>
          }
        />
        <Route
          path="/cancel"
          element={
            <PrivateRoute>
              <Cancel />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/approval-pending"
          element={
            <PrivateRoute>
              <ApprovalPending />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

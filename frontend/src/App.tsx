
import { lazy } from 'react';
import '@/App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import PrivateRoute from '@/context/PrivateRoutes';
import PublicRoute from '@/context/PublicRoutes';
import Success from '@/pages/success';
import Cancel from '@/pages/cancel';
const Home = lazy(() => import('@/pages/home'));
const About = lazy(() => import('@/pages/about'));
const Login = lazy(() => import('@/pages/login'));
const Signup = lazy(() => import('@/pages/signup'));
const Profile = lazy(() => import('@/pages/profile'));
const NotFound = lazy(() => import('@/pages/notfound'));
const ForgotPassword = lazy(() => import('@/pages/forgotpassword'));
const ResetPassword = lazy(() => import('@/pages/resetPassword'));
const Users = lazy(() => import('@/pages/users'));
const Content = lazy(() => import('@/pages/content'));
const Subscription = lazy(() => import('@/pages/subscription'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fallback Route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
        {/* Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
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
          path="/content"
          element={
            <PrivateRoute>
              <Content />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

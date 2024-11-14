import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Authorization/Login.jsx';
import ForgotPassword from './pages/Authorization/ForgotPassword.jsx';
import ResetConfirmation from './pages/Authorization/ResetConfirmation.jsx';
import ResetPassword from './pages/Authorization/ResetPassword.jsx';
import Register from './pages/Authorization/Register.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import VehicleList from './components/VehicleList.jsx';
import ProtectedRoute from './components/protectedRoute.js';
import Navbar from './components/navbar.jsx';
import BookingList from './components/Booking/BookingList.jsx';
import BookingConfirmation from './pages/BookingConfirmation.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentCancel from './pages/PaymentCancel.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-confirmation" element={<ResetConfirmation />} />
        <Route path="/reset-password/" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Only authenticated users can access these) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/vehicles" element={
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        } />
        <Route path="/booking/my-bookings" element={
          <ProtectedRoute>
            <BookingProvider>
              <BookingList />
            </BookingProvider>
          </ProtectedRoute>
        } />
        <Route path="/booking/confirmation" element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        } />

        <Route path="/payment-success" element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        } />
        <Route path="/payment-cancel" element={
          <ProtectedRoute>
          <PaymentCancel />
          </ProtectedRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

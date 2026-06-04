import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSettings } from './utils/storage';
import Navbar          from './components/Navbar';
import ProtectedRoute  from './components/ProtectedRoute';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Dashboard       from './pages/Dashboard';
import NotFound        from './pages/NotFound';
import './index.css';

// Apply stored theme before first paint
const storedTheme = getSettings().theme || 'dark';
document.documentElement.setAttribute('data-theme', storedTheme);

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />

        <Routes>
          <Route path="/"          element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* React Toastify container */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        style={{ top: '72px' }}
      />
    </BrowserRouter>
  );
}

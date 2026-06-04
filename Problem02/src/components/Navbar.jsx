import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser, logoutUser } from '../utils/storage';
import '../styles/Navbar.css';

// SVG icons
const DashIcon = () => (
  <svg style={{ width:14, height:14, stroke:'currentColor', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const LogoutIcon = () => (
  <svg style={{ width:14, height:14, stroke:'currentColor', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }} viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  // Re-read on every render so updates propagate
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    toast.info('You have been logged out.');
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

  const LoggedInLinks = () => (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        onClick={closeMenu}
        id="nav-dashboard-link"
      >
        <DashIcon /> Dashboard
      </NavLink>
      <button
        className="nav-link"
        onClick={handleLogout}
        id="btn-navbar-logout"
      >
        <LogoutIcon /> Logout
      </button>
    </>
  );

  const LoggedOutLinks = () => (
    <>
      <NavLink
        to="/login"
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        onClick={closeMenu}
        id="nav-login-link"
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        className={({ isActive }) =>
          `nav-link nav-link-primary${isActive ? ' active' : ''}`
        }
        onClick={closeMenu}
        id="nav-register-link"
      >
        Get Started
      </NavLink>
    </>
  );

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" aria-label="AuthDash Home">
        <div className="navbar-logo" aria-hidden="true">AD</div>
        <span className="navbar-name">Auth<span>Dash</span></span>
      </Link>

      {/* Desktop links */}
      <div className="navbar-links desktop">
        {user ? (
          <div className="nav-user">
            <div className="nav-avatar" aria-hidden="true">{getInitial(user.name)}</div>
            <span className="nav-user-name">{user.name}</span>
            <LoggedInLinks />
          </div>
        ) : (
          <LoggedOutLinks />
        )}
      </div>

      {/* Hamburger */}
      <button
        className={`nav-hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        id="btn-nav-hamburger"
      >
        <span /><span /><span />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu" role="menu">
          {user ? <LoggedInLinks /> : <LoggedOutLinks />}
        </div>
      )}
    </nav>
  );
}

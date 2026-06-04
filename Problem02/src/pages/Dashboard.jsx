import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser, logoutUser, getUsers } from '../utils/storage';
import EditProfileModal    from '../components/modals/EditProfileModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import SettingsModal       from '../components/modals/SettingsModal';
import HelpCenterModal     from '../components/modals/HelpCenterModal';
import '../styles/Dashboard.css';

// ----------------------------------------------------------------
// SVG icons
// ----------------------------------------------------------------
const UsersIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
);
const HashIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const HelpIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function formatDate(iso) {
  if (!iso) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(iso));
  } catch { return iso; }
}

function formatDateTime(iso) {
  if (!iso) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] ?? 'U').toUpperCase();
}

// ----------------------------------------------------------------
// Dashboard
// ----------------------------------------------------------------
export default function Dashboard() {
  const navigate = useNavigate();

  // Re-derive on each render after modal saves
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const currentUser = getCurrentUser();
  const allUsers    = getUsers();
  const fullData    = allUsers.find((u) => u.id === currentUser?.id);
  const memberSince = fullData?.createdAt || new Date().toISOString().split('T')[0];
  const lastLogin   = currentUser?.lastLogin || fullData?.lastLogin;

  const [modal,    setModal]   = useState(null); // 'edit' | 'password' | 'settings' | 'help'
  const [loggingOut, setLoggingOut] = useState(false);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((r) => setTimeout(r, 500));
    logoutUser();
    toast.info('Logged out successfully. See you soon!');
    navigate('/login', { replace: true });
  };

  // Close any modal
  const closeModal = () => setModal(null);

  // After edit profile saves, force re-read from localStorage
  const handleProfileSuccess = () => {
    refresh();
  };

  // Theme change handler (passed to SettingsModal)
  const handleThemeChange = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const activityItems = [
    { dot: 'dot-green', title: 'Login successful',  time: lastLogin ? formatDateTime(lastLogin) : 'Just now' },
    { dot: 'dot-blue',  title: 'Account registered', time: formatDate(memberSince) },
    { dot: 'dot-cyan',  title: 'Profile created',    time: formatDate(memberSince) },
  ];

  return (
    <>
      <main className="dashboard-layout" id="main-dashboard">
        {/* ---- Header ---- */}
        <header className="dashboard-header">
          <h1 className="dashboard-greeting">
            {getGreeting()},{' '}
            <span>{currentUser?.name?.split(' ')[0] ?? 'User'}!</span>
          </h1>
          <p className="dashboard-date">{todayStr}</p>
        </header>

        {/* ---- Stats ---- */}
        <section className="stats-grid" aria-label="Account statistics">
          <div className="stat-card stat-card-1">
            <div className="stat-icon stat-icon-purple"><UsersIcon /></div>
            <div className="stat-info">
              <div className="stat-value" id="total-users-count">{allUsers.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>

          <div className="stat-card stat-card-2">
            <div className="stat-icon stat-icon-green"><CheckIcon /></div>
            <div className="stat-info">
              <div className="stat-value">Active</div>
              <div className="stat-label">Account Status</div>
            </div>
          </div>

          <div className="stat-card stat-card-3">
            <div className="stat-icon stat-icon-cyan"><CalendarIcon /></div>
            <div className="stat-info">
              <div className="stat-value stat-value-sm">{formatDate(memberSince)}</div>
              <div className="stat-label">Member Since</div>
            </div>
          </div>

          <div className="stat-card stat-card-4">
            <div className="stat-icon stat-icon-amber"><ClockIcon /></div>
            <div className="stat-info">
              <div className="stat-value stat-value-sm">
                {lastLogin ? formatDateTime(lastLogin) : 'Just now'}
              </div>
              <div className="stat-label">Last Login</div>
            </div>
          </div>
        </section>

        {/* ---- Main Grid ---- */}
        <div className="dashboard-grid">
          {/* Profile Card */}
          <aside>
            <div className="profile-card">
              <div
                className="profile-avatar"
                aria-label={`Avatar for ${currentUser?.name}`}
                id="profile-avatar"
              >
                {getInitials(currentUser?.name)}
                <div className="profile-avatar-badge" title="Online" />
              </div>

              <div className="profile-name"  id="profile-name">{currentUser?.name}</div>
              <div className="profile-email" id="profile-email">{currentUser?.email}</div>
              <div className="profile-badge">Verified Member</div>

              <div className="profile-divider" />

              <div className="profile-info-row">
                <div className="info-item">
                  <div className="info-item-icon"><UserIcon /></div>
                  <div className="info-item-content">
                    <div className="info-item-label">Full Name</div>
                    <div className="info-item-value">{currentUser?.name}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon"><MailIcon /></div>
                  <div className="info-item-content">
                    <div className="info-item-label">Email Address</div>
                    <div className="info-item-value">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon"><CalendarIcon /></div>
                  <div className="info-item-content">
                    <div className="info-item-label">Registered On</div>
                    <div className="info-item-value">{formatDate(memberSince)}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon"><HashIcon /></div>
                  <div className="info-item-content">
                    <div className="info-item-label">User ID</div>
                    <div className="info-item-value">#{currentUser?.id}</div>
                  </div>
                </div>
              </div>

              <button
                className="btn-logout"
                onClick={handleLogout}
                disabled={loggingOut}
                id="btn-dashboard-logout"
                aria-label="Sign out"
              >
                <LogoutIcon />
                {loggingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          </aside>

          {/* Info Panel */}
          <section className="info-panel" aria-label="Dashboard panels">
            {/* Recent Activity */}
            <div className="panel-card">
              <h2 className="panel-title">
                <ActivityIcon /> Recent Activity
              </h2>
              <div className="activity-list">
                {activityItems.map((item, i) => (
                  <div className="activity-item" key={i}>
                    <div className={`activity-dot ${item.dot}`} />
                    <div className="activity-text">
                      <div className="activity-title">{item.title}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="panel-card">
              <h2 className="panel-title">
                <ZapIcon /> Quick Actions
              </h2>
              <div className="quick-links">
                <button
                  className="quick-btn"
                  id="btn-edit-profile"
                  onClick={() => setModal('edit')}
                >
                  <EditIcon /> Edit Profile
                </button>
                <button
                  className="quick-btn"
                  id="btn-change-password"
                  onClick={() => setModal('password')}
                >
                  <LockIcon /> Change Password
                </button>
                <button
                  className="quick-btn"
                  id="btn-settings"
                  onClick={() => setModal('settings')}
                >
                  <SettingsIcon /> Settings
                </button>
                <button
                  className="quick-btn"
                  id="btn-help"
                  onClick={() => setModal('help')}
                >
                  <HelpIcon /> Help Center
                </button>
              </div>
            </div>

            {/* Registered Users */}
            <div className="panel-card">
              <h2 className="panel-title">
                <UsersIcon /> Registered Users ({allUsers.length})
              </h2>
              <div className="users-list" id="registered-users-list">
                {allUsers.length === 0 ? (
                  <p style={{ color: 'var(--color-text-3)', fontSize: '0.85rem' }}>
                    No users registered yet.
                  </p>
                ) : (
                  allUsers.map((u) => (
                    <div className="user-list-item" key={u.id}>
                      <div className="user-list-avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="user-list-name">{u.name}</div>
                        <div className="user-list-email">{u.email}</div>
                      </div>
                      {u.id === currentUser?.id && (
                        <span className="user-list-you">You</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ---- Modals ---- */}
      {modal === 'edit' && (
        <EditProfileModal
          onClose={closeModal}
          onSuccess={handleProfileSuccess}
        />
      )}
      {modal === 'password' && (
        <ChangePasswordModal onClose={closeModal} />
      )}
      {modal === 'settings' && (
        <SettingsModal
          onClose={closeModal}
          onThemeChange={handleThemeChange}
        />
      )}
      {modal === 'help' && (
        <HelpCenterModal onClose={closeModal} />
      )}
    </>
  );
}

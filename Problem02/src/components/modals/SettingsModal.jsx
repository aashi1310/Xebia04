import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getSettings, saveSettings } from '../../utils/storage';
import '../../styles/Modal.css';

// Inline SVG icons
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const SunIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function SettingsModal({ onClose, onThemeChange }) {
  const [settings, setSettings] = useState(() => getSettings());
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleToggle(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleTheme(theme) {
    setSettings((prev) => ({ ...prev, theme }));
    // Apply immediately for preview
    document.documentElement.setAttribute('data-theme', theme);
    onThemeChange?.(theme);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    saveSettings(settings);
    // Ensure theme is persisted
    document.documentElement.setAttribute('data-theme', settings.theme);
    onThemeChange?.(settings.theme);
    setSaving(false);
    toast.success('Settings saved successfully.');
    onClose();
  }

  const Toggle = ({ id, checked, onChange, label, desc }) => (
    <div className="setting-row">
      <div className="setting-label-group">
        <span className="setting-label">{label}</span>
        {desc && <span className="setting-desc">{desc}</span>}
      </div>
      <label className="toggle-switch" aria-label={label}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon"><SettingsIcon /></div>
          <div className="modal-title-group">
            <h2 className="modal-title" id="settings-title">Settings</h2>
            <p className="modal-subtitle">Manage your preferences</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close" id="btn-close-settings">
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          {/* Theme */}
          <div className="settings-section">
            <p className="settings-section-title">Appearance</p>
            <div className="theme-options">
              <button
                type="button"
                className={`theme-option${settings.theme === 'light' ? ' active' : ''}`}
                onClick={() => handleTheme('light')}
                id="btn-theme-light"
              >
                <SunIcon /> Light Mode
              </button>
              <button
                type="button"
                className={`theme-option${settings.theme === 'dark' ? ' active' : ''}`}
                onClick={() => handleTheme('dark')}
                id="btn-theme-dark"
              >
                <MoonIcon /> Dark Mode
              </button>
            </div>
          </div>

          <div className="modal-divider" />

          {/* Account */}
          <div className="settings-section">
            <p className="settings-section-title">Account</p>
            <Toggle
              id="toggle-remember-me"
              label="Remember Me"
              desc="Stay logged in on this device"
              checked={settings.rememberMe}
              onChange={() => handleToggle('rememberMe')}
            />
          </div>

          <div className="modal-divider" />

          {/* Notifications */}
          <div className="settings-section">
            <p className="settings-section-title">Notifications</p>
            <Toggle
              id="toggle-email-notif"
              label="Email Notifications"
              desc="Receive account updates via email"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <Toggle
              id="toggle-marketing-notif"
              label="Marketing Emails"
              desc="Receive product news and offers"
              checked={settings.marketingNotifications}
              onChange={() => handleToggle('marketingNotifications')}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={onClose}
            id="btn-cancel-settings"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-primary"
            onClick={handleSave}
            disabled={saving}
            id="btn-save-settings"
          >
            {saving ? <><span className="spinner" />Saving…</> : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

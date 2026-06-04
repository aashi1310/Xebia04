import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser, changePassword } from '../../utils/storage';
import '../../styles/Modal.css';
import '../../styles/Auth.css';

// Inline SVG icons
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

function pwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return s;
}
const strengthLabel = ['', 'Weak', 'Medium', 'Strong'];
const strengthClass = ['', 'weak', 'medium', 'strong'];

export default function ChangePasswordModal({ onClose }) {
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [errors,  setErrors]  = useState({});
  const [show,    setShow]    = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const strength = pwStrength(form.newPassword);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate() {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required.';
    if (!form.newPassword)     errs.newPassword = 'New password is required.';
    else if (form.newPassword.length < 8)
                               errs.newPassword = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your new password.';
    else if (form.newPassword !== form.confirmPassword)
                               errs.confirmPassword = 'Passwords do not match.';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = changePassword({
      id:              currentUser.id,
      currentPassword: form.currentPassword,
      newPassword:     form.newPassword,
    });

    setLoading(false);

    if (!result.success) {
      setErrors({ currentPassword: result.message });
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    onClose();
  }

  const cls = (field) =>
    `form-input${errors[field] ? ' error' : form[field] ? ' success-field' : ''}`;

  const ToggleBtn = ({ field, label }) => (
    <button
      type="button"
      className="toggle-password"
      onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
      aria-label={show[field] ? `Hide ${label}` : `Show ${label}`}
    >
      {show[field] ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-pw-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon"><LockIcon /></div>
          <div className="modal-title-group">
            <h2 className="modal-title" id="change-pw-title">Change Password</h2>
            <p className="modal-subtitle">Update your account password</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close" id="btn-close-change-pw">
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          {errors.server && (
            <div className="server-error" role="alert">{errors.server}</div>
          )}

          <form
            id="form-change-password"
            className="modal-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="cp-current">Current Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="cp-current"
                  name="currentPassword"
                  type={show.current ? 'text' : 'password'}
                  className={cls('currentPassword')}
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                  aria-invalid={!!errors.currentPassword}
                />
                <ToggleBtn field="current" label="current password" />
              </div>
              {errors.currentPassword && (
                <span className="field-error" role="alert">{errors.currentPassword}</span>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="cp-new">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="cp-new"
                  name="newPassword"
                  type={show.new ? 'text' : 'password'}
                  className={cls('newPassword')}
                  placeholder="Min. 8 characters"
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!errors.newPassword}
                />
                <ToggleBtn field="new" label="new password" />
              </div>
              {errors.newPassword && (
                <span className="field-error" role="alert">{errors.newPassword}</span>
              )}
              {/* Strength */}
              {form.newPassword && (
                <div aria-label={`Password strength: ${strengthLabel[strength]}`}>
                  <div className="pw-strength">
                    {[1,2,3].map((i) => (
                      <div key={i} className={`pw-bar${strength >= i ? ` ${strengthClass[strength]}` : ''}`} />
                    ))}
                  </div>
                  <p className={`pw-label ${strengthClass[strength]}`}>
                    {strengthLabel[strength]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="cp-confirm">Confirm New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="cp-confirm"
                  name="confirmPassword"
                  type={show.confirm ? 'text' : 'password'}
                  className={
                    `form-input${errors.confirmPassword
                      ? ' error'
                      : (form.confirmPassword && form.newPassword === form.confirmPassword)
                        ? ' success-field'
                        : ''}`
                  }
                  placeholder="Repeat new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                />
                <ToggleBtn field="confirm" label="confirm password" />
              </div>
              {errors.confirmPassword ? (
                <span className="field-error" role="alert">{errors.confirmPassword}</span>
              ) : (form.confirmPassword && form.newPassword === form.confirmPassword) ? (
                <span className="field-success">Passwords match</span>
              ) : null}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={onClose}
            id="btn-cancel-change-pw"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="form-change-password"
            className="btn-modal-primary"
            disabled={loading}
            id="btn-save-change-pw"
          >
            {loading ? <><span className="spinner" />Updating…</> : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

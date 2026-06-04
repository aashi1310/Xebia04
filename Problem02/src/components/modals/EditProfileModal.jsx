import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser, updateProfile } from '../../utils/storage';
import '../../styles/Modal.css';
import '../../styles/Auth.css';

// SVG icons (inline, no deps)
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function EditProfileModal({ onClose, onSuccess }) {
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    name:  currentUser?.name  || '',
    email: currentUser?.email || '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  // Trap focus inside modal
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate() {
    const errs = {};
    if (!form.name.trim())         errs.name  = 'Full name is required.';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email.trim())        errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                   errs.email = 'Please enter a valid email address.';
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
    await new Promise((r) => setTimeout(r, 600));

    const result = updateProfile({
      id:    currentUser.id,
      name:  form.name,
      email: form.email,
    });

    setLoading(false);

    if (!result.success) {
      setErrors({ server: result.message });
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    onSuccess?.();
    onClose();
  }

  const cls = (field) =>
    `form-input${errors[field] ? ' error' : form[field] ? ' success-field' : ''}`;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <UserIcon />
          </div>
          <div className="modal-title-group">
            <h2 className="modal-title" id="edit-profile-title">Edit Profile</h2>
            <p className="modal-subtitle">Update your account information</p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            id="btn-close-edit-profile"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {errors.server && (
            <div className="server-error" role="alert">{errors.server}</div>
          )}

          <form
            className="modal-form"
            id="form-edit-profile"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="ep-name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon"><UserIcon /></span>
                <input
                  id="ep-name"
                  name="name"
                  type="text"
                  className={cls('name')}
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-describedby={errors.name ? 'ep-name-err' : undefined}
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && (
                <span id="ep-name-err" className="field-error" role="alert">
                  {errors.name}
                </span>
              )}
              {!errors.name && form.name.trim().length > 1 && (
                <span className="field-success">Looks good!</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="ep-email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><MailIcon /></span>
                <input
                  id="ep-email"
                  name="email"
                  type="email"
                  className={cls('email')}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-describedby={errors.email ? 'ep-email-err' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <span id="ep-email-err" className="field-error" role="alert">
                  {errors.email}
                </span>
              )}
              {!errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                <span className="field-success">Valid email</span>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={onClose}
            id="btn-cancel-edit-profile"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="form-edit-profile"
            className="btn-modal-primary"
            disabled={loading}
            id="btn-save-edit-profile"
          >
            {loading ? (
              <><span className="spinner" />Saving…</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

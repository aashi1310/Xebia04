import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../utils/storage';
import '../styles/Auth.css';

// Inline SVG icons
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);
const RegisterIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width:28, height:28, stroke:'#fff', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

function passwordStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return s;
}
const strengthLabel = ['', 'Weak', 'Medium', 'Strong'];
const strengthClass = ['', 'weak', 'medium', 'strong'];

export default function Register() {
  const navigate  = useNavigate();

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors,  setErrors]  = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [showCf,  setShowCf]  = useState(false);
  const [loading, setLoading] = useState(false);

  const pwStr = passwordStrength(form.password);

  function validate() {
    const errs = {};
    if (!form.name.trim())              errs.name  = 'Full name is required.';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email.trim())             errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                        errs.email = 'Please enter a valid email address.';
    if (!form.password)                 errs.password = 'Password is required.';
    else if (form.password.length < 8)  errs.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword)          errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
                                        errs.confirmPassword = 'Passwords do not match.';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (errors.server) setErrors((prev) => ({ ...prev, server: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = registerUser({ name: form.name, email: form.email, password: form.password });
    setLoading(false);

    if (!result.success) {
      setErrors({ server: result.message });
      toast.error(result.message);
      return;
    }

    toast.success('Account created successfully! Please sign in.');
    navigate('/login');
  }

  const cls = (field) =>
    `form-input${errors[field] ? ' error' : form[field] ? ' success-field' : ''}`;

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <RegisterIcon />
          </div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join AuthDash today — it&apos;s free</p>
        </div>

        {errors.server && (
          <div className="server-error" role="alert">{errors.server}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><UserIcon /></span>
              <input
                id="reg-name"
                name="name"
                type="text"
                className={cls('name')}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                aria-describedby={errors.name ? 'reg-name-err' : undefined}
                aria-invalid={!!errors.name}
              />
            </div>
            {errors.name ? (
              <span id="reg-name-err" className="field-error" role="alert">{errors.name}</span>
            ) : form.name.trim().length > 1 ? (
              <span className="field-success">Looks good!</span>
            ) : null}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><MailIcon /></span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className={cls('email')}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-describedby={errors.email ? 'reg-email-err' : undefined}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email ? (
              <span id="reg-email-err" className="field-error" role="alert">{errors.email}</span>
            ) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? (
              <span className="field-success">Valid email</span>
            ) : null}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="reg-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className={cls('password')}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-describedby={errors.password ? 'reg-pw-err' : 'reg-pw-strength'}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                id="btn-toggle-pw-reg"
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span id="reg-pw-err" className="field-error" role="alert">{errors.password}</span>
            )}
            {form.password && (
              <div id="reg-pw-strength" aria-label={`Password strength: ${strengthLabel[pwStr]}`}>
                <div className="pw-strength">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`pw-bar${pwStr >= i ? ` ${strengthClass[pwStr]}` : ''}`} />
                  ))}
                </div>
                <p className={`pw-label ${strengthClass[pwStr]}`}>{strengthLabel[pwStr]} password</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showCf ? 'text' : 'password'}
                className={
                  `form-input${errors.confirmPassword
                    ? ' error'
                    : (form.confirmPassword && form.password === form.confirmPassword)
                      ? ' success-field' : ''}`
                }
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                aria-describedby={errors.confirmPassword ? 'reg-cf-err' : undefined}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowCf((s) => !s)}
                aria-label={showCf ? 'Hide confirm password' : 'Show confirm password'}
                id="btn-toggle-pw-confirm"
              >
                {showCf ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <span id="reg-cf-err" className="field-error" role="alert">{errors.confirmPassword}</span>
            ) : (form.confirmPassword && form.password === form.confirmPassword) ? (
              <span className="field-success">Passwords match</span>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            id="btn-register-submit"
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" /> Creating account…</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider" />
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="link-to-login">Sign in instead</Link>
        </p>
      </div>
    </div>
  );
}

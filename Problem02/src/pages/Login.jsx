import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../utils/storage';
import '../styles/Auth.css';

// Inline SVG icons
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
const LoginKeyIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width:28, height:28, stroke:'#fff', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }}>
    <path d="M15 3H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H15"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.email.trim())
      errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (!form.password)
      errs.password = 'Password is required.';
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
    await new Promise((r) => setTimeout(r, 700));

    const result = loginUser({ email: form.email, password: form.password });
    setLoading(false);

    if (!result.success) {
      setErrors({ server: result.message });
      toast.error(result.message);
      return;
    }

    toast.success(`Welcome back, ${result.user.name}!`);
    navigate(redirectTo, { replace: true });
  }

  const cls = (field) =>
    `form-input${errors[field] ? ' error' : form[field] ? ' success-field' : ''}`;

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LoginKeyIcon />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your AuthDash account</p>
        </div>

        {errors.server && (
          <div className="server-error" role="alert">{errors.server}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><MailIcon /></span>
              <input
                id="login-email"
                name="email"
                type="email"
                className={cls('email')}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-describedby={errors.email ? 'login-email-err' : undefined}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <span id="login-email-err" className="field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="login-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className={cls('password')}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-describedby={errors.password ? 'login-pw-err' : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                id="btn-toggle-pw-login"
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span id="login-pw-err" className="field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            id="btn-login-submit"
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" /> Signing in…</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-divider" />
        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" id="link-to-register">Create one for free</Link>
        </p>
      </div>
    </div>
  );
}

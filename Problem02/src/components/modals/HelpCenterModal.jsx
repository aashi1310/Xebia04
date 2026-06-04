import { useEffect } from 'react';
import '../../styles/Modal.css';

// Inline SVG icons
const HelpIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const FAQ_ITEMS = [
  {
    q: 'How do I update my profile?',
    a: 'Click "Edit Profile" in the Quick Actions section of your dashboard. You can update your name and email address. Changes are saved immediately to your account.',
  },
  {
    q: 'How do I change my password?',
    a: 'Click "Change Password" in the Quick Actions section. Enter your current password, then your new password (minimum 8 characters), and confirm it. Your password will be updated instantly.',
  },
  {
    q: 'How do I enable Dark Mode?',
    a: 'Click "Settings" in the Quick Actions section, then select "Dark Mode" under Appearance. The change is applied immediately and saved for future sessions.',
  },
  {
    q: 'Will my data be shared with third parties?',
    a: 'No. All your data is stored locally on your device using browser localStorage. Nothing is transmitted to any server.',
  },
];

export default function HelpCenterModal({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon"><HelpIcon /></div>
          <div className="modal-title-group">
            <h2 className="modal-title" id="help-title">Help Center</h2>
            <p className="modal-subtitle">Support &amp; frequently asked questions</p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
            id="btn-close-help"
          >
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          {/* Contact Support */}
          <h3
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-3)',
              marginBottom: '0.75rem',
            }}
          >
            Contact Support
          </h3>
          <div className="help-contact-grid">
            <div className="help-contact-card">
              <div className="help-contact-label">
                <span style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <span style={{ width:12, height:12, display:'inline-flex' }}>
                    <svg viewBox="0 0 24 24" style={{ width:12, height:12, stroke:'var(--color-text-3)', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }}>
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                    </svg>
                  </span>
                  Email
                </span>
              </div>
              <div className="help-contact-value">
                <a href="mailto:support@example.com">support@example.com</a>
              </div>
            </div>
            <div className="help-contact-card">
              <div className="help-contact-label">
                <span style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <span style={{ width:12, height:12, display:'inline-flex' }}>
                    <svg viewBox="0 0 24 24" style={{ width:12, height:12, stroke:'var(--color-text-3)', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </span>
                  Response Time
                </span>
              </div>
              <div className="help-contact-value">24–48 Hours</div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* FAQ */}
          <h3
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-3)',
              marginBottom: '0.75rem',
            }}
          >
            Frequently Asked Questions
          </h3>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div className="faq-item" key={i}>
                <p className="faq-q">{item.q}</p>
                <p className="faq-a">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="modal-divider" />

          {/* Privacy */}
          <h3
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-3)',
              marginBottom: '0.75rem',
            }}
          >
            Privacy
          </h3>
          <div className="privacy-notice">
            We respect your privacy. All data is stored locally on your device and is never shared
            with third parties. You can clear your data at any time by logging out and clearing
            your browser&apos;s localStorage.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-primary"
            onClick={onClose}
            id="btn-close-help-footer"
            style={{ maxWidth: '160px', margin: '0 auto' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

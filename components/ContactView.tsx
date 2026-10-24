import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { ABOUT_LINKS } from '../content';

const TO_EMAIL = 'cherin0115@gmail.com';
const FORM_ID = 'xvkkgjvb';

const ContactView: React.FC = () => {
  const [state, handleSubmit] = useForm(FORM_ID);

  return (
    <div className="case-study-panel contact-view" style={{ position: 'relative', zIndex: 1, width: 'min(94vw, 700px)', margin: '0 32px', padding: '16px clamp(20px, 5vw, 48px) 56px', boxSizing: 'border-box', background: 'var(--panel)', borderRadius: 2 }}>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 500, color: 'var(--ink)', margin: '24px 0 28px' }}>
        Get in touch
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, paddingBottom: 28, marginBottom: 32, borderBottom: '1px solid var(--rule)' }}>
        <div>
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>Email</div>
          <a href={`mailto:${TO_EMAIL}`} className="contact-link" style={{ fontSize: 14, color: 'var(--ink)' }}>{TO_EMAIL}</a>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>Elsewhere</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {ABOUT_LINKS.filter(l => !l.href.startsWith('mailto:')).map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="contact-link" style={{ fontSize: 14, color: 'var(--ink)' }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {state.succeeded ? (
        <div className="font-mono" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', padding: '8px 0 24px' }}>
          Thanks — your message is on its way. I'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
            <label style={{ flex: '1 1 220px' }}>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 8 }}>Your name</div>
              <input
                name="name"
                placeholder="your full name"
                className="contact-input"
              />
            </label>
            <label style={{ flex: '1 1 220px' }}>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 8 }}>Email address</div>
              <input
                type="email"
                name="email"
                required
                placeholder="your email address"
                className="contact-input"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="contact-error" />
            </label>
          </div>

          <label style={{ display: 'block', marginBottom: 24 }}>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 8 }}>Message</div>
            <textarea
              name="message"
              required
              placeholder="write something…"
              rows={6}
              className="contact-input"
              style={{ resize: 'vertical' }}
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} className="contact-error" />
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button type="submit" disabled={state.submitting} className="font-mono contact-send">
              {state.submitting ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      )}

      <style>{`
        .contact-link {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .contact-link:hover {
          color: var(--bullet);
        }
        .contact-input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--rule);
          background: var(--base);
          border-radius: 3px;
          padding: 11px 13px;
          font-size: 14px;
          color: var(--ink);
          font-family: inherit;
          outline: none;
          transition: border-color 150ms ease;
        }
        .contact-input::placeholder {
          color: var(--faint);
        }
        .contact-input:focus {
          border-color: var(--bullet);
        }
        .contact-error {
          font-size: 12px;
          color: #B3402E;
          margin-top: 6px;
        }
        .contact-send {
          background: var(--ink);
          color: var(--base);
          border: none;
          border-radius: 3px;
          padding: 11px 22px;
          font-size: 13px;
          cursor: pointer;
          transition: opacity 150ms ease;
        }
        .contact-send:disabled {
          opacity: 0.55;
          cursor: default;
        }
        .contact-send:hover:not(:disabled) {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
};

export default ContactView;

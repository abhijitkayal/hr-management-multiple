"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  async function login() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const loginId = data.user.id || "";

      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "hr") {
        router.push(`/hr/${loginId}`);
      } else if (data.user.role === "employee") {
        router.push(`/employee-dashboard/${loginId}/tasks`);
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      alert("Please enter your email address");
      return;
    }

    try {
      setForgotLoading(true);

      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      alert(data.message);

      if (data.success) {
        setShowForgotPassword(false);
        setForgotEmail("");
      }
    } catch (error) {
      console.log(error);
      alert("Unable to send reset link");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #f5f3ef; }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.15fr 0.95fr;
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #131313 100%);
        }

        .hero-panel {
          position: relative;
          overflow: hidden;
          padding: 56px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hero-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 20%, rgba(212,132,26,0.18), transparent 28%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 22%), radial-gradient(circle at 60% 80%, rgba(212,132,26,0.12), transparent 24%);
          pointer-events: none;
        }

        .brand-mark {
          position: relative;
          z-index: 1;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #d4841a;
          display: grid;
          place-items: center;
          font-weight: 800;
          color: #fff;
          margin-bottom: 42px;
        }

        .hero-copy { position: relative; z-index: 1; max-width: 520px; }
        .hero-kicker {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 18px;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.04em;
          margin: 0;
        }

        .hero-title em { color: #d4841a; font-style: italic; }
        .hero-subtitle {
          margin-top: 18px;
          max-width: 460px;
          color: rgba(255,255,255,0.72);
          font-size: 15px;
          line-height: 1.7;
        }

        .hero-footer {
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,0.36);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .form-panel {
          background: #f5f3ef;
          display: grid;
          place-items: center;
          padding: 32px;
        }

        .form-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.86);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 30px 80px rgba(0,0,0,0.08);
          border-radius: 28px;
          padding: 34px;
        }

        .form-eyebrow {
          margin: 0 0 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d4841a;
        }

        .form-title {
          margin: 0;
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
          color: #141414;
        }

        .form-subtitle {
          margin: 12px 0 28px;
          color: #6b7280;
          line-height: 1.6;
          font-size: 14px;
        }

        .input-group { margin-bottom: 18px; }
        .input-label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .input-field-wrap { position: relative; }
        .input-field {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          border: 1.5px solid #e6e1d9;
          background: #fff;
          padding: 0 46px 0 16px;
          font-size: 14px;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .input-field:focus, .field-focused {
          border-color: #d4841a;
          box-shadow: 0 0 0 4px rgba(212,132,26,0.12);
        }
        .input-icon {
          position: absolute;
          top: 50%; right: 16px;
          transform: translateY(-50%);
          color: #a3a3a3;
          pointer-events: none;
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin: -6px 0 24px;
        }
        .forgot-link {
          border: 0;
          background: transparent;
          color: #d4841a;
          padding: 0;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .btn-login {
          width: 100%;
          height: 52px;
          border: 0;
          border-radius: 14px;
          background: #0a0a0a;
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform .2s ease, background .2s ease;
        }
        .btn-login:disabled { cursor: not-allowed; opacity: 0.75; }
        .btn-login:not(:disabled):hover { transform: translateY(-1px); background: #1a1a1a; }
        .btn-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 999px;
          animation: spin 0.8s linear infinite;
        }

        .form-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
          color: #d1d5db;
          font-size: 12px;
        }
        .form-divider::before,
        .form-divider::after {
          content: '';
          height: 1px;
          flex: 1;
          background: #ece7df;
        }

        .form-footnote {
          text-align: center;
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        .form-footnote a {
          color: #141414;
          font-weight: 700;
          text-decoration: none;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
        }
        .modal-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          overflow: hidden;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 28px 90px rgba(0,0,0,0.22);
          font-family: 'DM Sans', sans-serif;
        }
        .modal-accent { height: 4px; background: linear-gradient(90deg, #d4841a, #f0a84e); }
        .modal-glow {
          position: absolute;
          top: 0; right: 0;
          width: 280px; height: 280px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(212,132,26,0.12) 0%, transparent 70%);
          transform: translate(28%, -28%);
          pointer-events: none;
        }
        .modal-body {
          position: relative;
          z-index: 1;
          padding: 32px;
        }
        .modal-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }
        .modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: rgba(212,132,26,0.1);
          margin-bottom: 18px;
        }
        .modal-title {
          margin: 0;
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          line-height: 1;
          letter-spacing: -0.03em;
          color: #111827;
        }
        .modal-copy {
          margin: 10px 0 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.7;
        }
        .modal-close {
          border: 0;
          background: transparent;
          color: #9ca3af;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          margin-top: -4px;
        }
        .modal-label {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .modal-input-wrap { position: relative; margin-bottom: 10px; }
        .modal-input {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          border: 1.5px solid #e8e8e8;
          background: #fafafa;
          padding: 0 16px 0 46px;
          font-size: 14px;
          outline: none;
          transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }
        .modal-input:focus {
          border-color: #d4841a;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(212,132,26,0.1);
        }
        .modal-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb;
          pointer-events: none;
        }
        .modal-note {
          margin: 10px 0 0;
          color: #9ca3af;
          font-size: 12px;
        }
        .modal-submit,
        .modal-secondary {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
        }
        .modal-submit {
          border: 0;
          background: #0a0a0a;
          color: white;
          margin-top: 14px;
        }
        .modal-submit:disabled {
          cursor: not-allowed;
          background: #c4791a;
          opacity: 0.85;
        }
        .modal-submit:not(:disabled):hover {
          transform: translateY(-1px);
          background: #1a1a1a;
        }
        .modal-secondary {
          border: 1.5px solid #e8e8e8;
          background: transparent;
          color: #555;
          margin-top: 14px;
        }
        .modal-secondary:hover {
          border-color: #0a0a0a;
          color: #0a0a0a;
          background: #fafafa;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .login-root { grid-template-columns: 1fr; }
          .hero-panel { min-height: 340px; padding: 36px 24px; }
          .form-panel { padding: 20px; }
          .form-card { padding: 28px 22px; }
        }
      `}</style>

      <div className="login-root">
        <section className="hero-panel">
          <div className="brand-mark">H</div>
          <div className="hero-copy">
            <p className="hero-kicker">Human Resources platform</p>
            <h1 className="hero-title">
              Manage your team with <em>clarity</em> and control.
            </h1>
            <p className="hero-subtitle">
              Sign in to handle employee workflows, task approvals, payroll, and internal operations from one place.
            </p>
          </div>
          <div className="hero-footer">Secure access for HR and employees</div>
        </section>

        <section className="form-panel">
          <div className="form-card">
            <p className="form-eyebrow">Welcome back</p>
            <h2 className="form-title">Sign in</h2>
            <p className="form-subtitle">Enter your credentials to continue.</p>

            <div className="input-group">
              <label className="input-label">Email address</label>
              <div className="input-field-wrap">
                <input
                  className={`input-field${focused === "email" ? " field-focused" : ""}`}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M2 8l10 6 10-6" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-field-wrap">
                <input
                  className={`input-field${focused === "password" ? " field-focused" : ""}`}
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="forgot-row">
              <button
                type="button"
                className="forgot-link"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotPassword(true);
                }}
              >
                Forgot password?
              </button>
            </div>

            <button className="btn-login" onClick={login} disabled={loading}>
              <span className="btn-content">
                {loading ? (
                  <>
                    <span className="spinner" /> Signing in…
                  </>
                ) : (
                  <>
                    Continue
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </span>
            </button>

           

            
          </div>
        </section>
      </div>

      {showForgotPassword && (
        <div className="modal-backdrop" onClick={() => setShowForgotPassword(false)}>
          <form
            onSubmit={handleForgotPassword}
            onClick={(e) => e.stopPropagation()}
            className="modal-card"
          >
            <div className="modal-accent" />
            <div className="modal-glow" />
            <div className="modal-body">
              <div className="modal-icon">
                <svg width="26" height="26" fill="none" stroke="#d4841a" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <circle cx="12" cy="16" r="1.2" fill="#d4841a" stroke="none" />
                </svg>
              </div>

              <div className="modal-head">
                <div>
                  <h3 className="modal-title">Reset your password</h3>
                  <p className="modal-copy">
                    Enter your work email and we&apos;ll send you a secure reset link.
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowForgotPassword(false)}
                  aria-label="Close reset password dialog"
                >
                  ×
                </button>
              </div>

              <label className="modal-label">Email address</label>
              <div className="modal-input-wrap">
                <span className="modal-input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M2 8l10 6 10-6" />
                  </svg>
                </span>
                <input
                  className="modal-input"
                  type="email"
                  placeholder="you@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <p className="modal-note">We&apos;ll detect your role and send the appropriate reset link.</p>

              <button type="submit" className="modal-submit" disabled={forgotLoading}>
                {forgotLoading ? "Sending link..." : "Send reset link"}
              </button>

              <button type="button" className="modal-secondary" onClick={() => setShowForgotPassword(false)}>
                Back to sign in
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// "use client";

// import {
//   useState,
// } from "react";

// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router =
//     useRouter();

//   const [email, setEmail] =
//     useState("");

//   const [
//     password,
//     setPassword,
//   ] = useState("");

//   async function login() {
//     console.log("hi");
//     const response =
//       await fetch(
//         "/api/auth/login",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             email,
//             password,
//           }),
//         }
//       );

//     const data =
//       await response.json();
//       console.log(data);

//     if (!data.success) {
//       return alert(
//         data.message
//       );
//     }

//     localStorage.setItem(
//       "token",
//       data.token
//     );

//     localStorage.setItem(
//       "user",
//       JSON.stringify(
//         data.user
//       )
//     );

//     alert(
//       "Login Success"
//     );

//    if (data.user.role === "admin") {
//   router.push("/admin");
// }

// else if (
//   data.user.role === "hr"
// ) {
//   router.push("/hr");
// }
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#111",
//         display: "flex",
//         justifyContent:
//           "center",
//         alignItems:
//           "center",
//       }}
//     >
//       <div
//         style={{
//           width: "350px",
//           background: "#1a1a1a",
//           padding: "30px",
//           borderRadius: "20px",
//           display: "grid",
//           gap: "16px",
//         }}
//       >
//         <h1
//           style={{
//             color: "#fff",
//           }}
//         >
//           Login
//         </h1>

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) =>
//             setEmail(
//               e.target.value
//             )
//           }
//           style={inputStyle}
//         />

//         <input
//           placeholder="Password"
//           value={password}
//           onChange={(e) =>
//             setPassword(
//               e.target.value
//             )
//           }
//           style={inputStyle}
//         />

//         <button
//           onClick={login}
//           style={buttonStyle}
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   padding: "14px",

//   borderRadius: "12px",

//   border: "1px solid #333",

//   background: "#000",

//   color: "#fff",
// };

// const buttonStyle = {
//   background: "#d4841a",

//   border: "none",

//   padding: "14px",

//   borderRadius: "12px",

//   color: "#fff",

//   cursor: "pointer",
// };

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPopup, setShowPopup] =
  useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        return alert(data.message);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setShowPopup(true);

      const loginId = data.user.id || "";

      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "hr") {
        router.push(`/hr/${loginId}`);
      } else if (data.user.role === "employee") {
        router.push(`/employee-dashboard/${loginId}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #ffffff; }

        .login-root {
          min-height: 100vh;
          background: #ffffff;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* ── Left decorative panel ── */
        .panel-left {
          position: relative;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          overflow: hidden;
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .panel-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .panel-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .panel-circle-1 { width: 520px; height: 520px; top: -180px; right: -180px; }
        .panel-circle-2 { width: 320px; height: 320px; bottom: 60px; left: -80px; }
        .panel-circle-3 { width: 160px; height: 160px; bottom: 220px; right: 60px; }

        .panel-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .panel-accent-line {
          position: absolute;
          left: 56px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(212,132,26,0.6) 40%, rgba(212,132,26,0.6) 60%, transparent);
        }

        .brand {
          position: relative;
          z-index: 1;
        }
        .brand-mark {
          width: 40px;
          height: 40px;
          background: #d4841a;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 48px;
        }
        .brand-mark span {
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.5px;
        }

        .panel-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4vw, 54px);
          line-height: 1.12;
          color: #ffffff;
          letter-spacing: -1px;
        }
        .panel-headline em {
          font-style: italic;
          color: #d4841a;
        }

        .panel-footer {
          position: relative;
          z-index: 1;
        }
        .panel-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ── Right form panel ── */
        .panel-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 48px;
          background: #ffffff;
          position: relative;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }
        .panel-right.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .form-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d4841a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 2px;
          background: #d4841a;
          border-radius: 2px;
        }

        .form-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(30px, 3vw, 42px);
          color: #0a0a0a;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .form-subtitle {
          font-size: 14px;
          color: #888;
          margin-bottom: 40px;
          font-weight: 300;
        }

        /* ── Input group ── */
        .input-group {
          position: relative;
          margin-bottom: 20px;
        }
        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
          transition: color 0.2s;
        }
        .input-group:has(.field-focused) .input-label {
          color: #0a0a0a;
        }

        .input-field-wrap {
          position: relative;
        }
        .input-field {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border: 1.5px solid #e8e8e8;
          border-radius: 12px;
          background: #fafafa;
          color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          -webkit-appearance: none;
        }
        .input-field::placeholder { color: #bbb; }
        .input-field:focus {
          border-color: #0a0a0a;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(10,10,10,0.05);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .input-field:focus ~ .input-icon,
        .input-field-wrap:has(.input-field:focus) .input-icon {
          color: #0a0a0a;
        }

        /* ── Submit button ── */
        .btn-login {
          width: 100%;
          padding: 15px 24px;
          margin-top: 8px;
          background: #0a0a0a;
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
        }
        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(212,132,26,0.3), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-login:hover {
          background: #1a1a1a;
          box-shadow: 0 8px 24px rgba(10,10,10,0.18);
          transform: translateY(-1px);
        }
        .btn-login:hover::after { opacity: 1; }
        .btn-login:active { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider / footer ── */
        .form-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 20px;
          color: #ccc;
          font-size: 12px;
        }
        .form-divider::before, .form-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #ebebeb;
        }

        .form-footnote {
          text-align: center;
          font-size: 13px;
          color: #aaa;
        }
        .form-footnote a {
          color: #d4841a;
          text-decoration: none;
          font-weight: 500;
        }
        .form-footnote a:hover { text-decoration: underline; }

        /* ── Corner decoration ── */
        .corner-deco {
          position: absolute;
          bottom: 40px;
          right: 40px;
          width: 80px;
          height: 80px;
          border-right: 2px solid #ebebeb;
          border-bottom: 2px solid #ebebeb;
          border-radius: 0 0 16px 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .panel-left { display: none; }
          .panel-right { padding: 40px 28px; }
        }
      `}</style>

      <div className="login-root">
        {/* ── Left Panel ── */}
        <div className={`panel-left ${mounted ? "visible" : ""}`}>
          <div className="panel-dot-grid" />
          <div className="panel-circle panel-circle-1" />
          <div className="panel-circle panel-circle-2" />
          <div className="panel-circle panel-circle-3" />
          <div className="panel-accent-line" />

          <div className="brand" style={{ position: "relative", zIndex: 1 }}>
            <div className="brand-mark"><span>A</span></div>
            <h2 className="panel-headline">
              Your workspace,<br /><em>redefined</em><br />for what's next.
            </h2>
          </div>

          <div className="panel-footer">
            <p className="panel-tagline">Secure · Reliable · Enterprise-grade</p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className={`panel-right ${mounted ? "visible" : ""}`}>
          <div className="corner-deco" />

          <div className="form-wrapper">
            <p className="form-eyebrow">Welcome back</p>
            <h1 className="form-title">Sign in</h1>
            <p className="form-subtitle">Enter your credentials to continue</p>

            {/* Email */}
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

            {/* Password */}
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

            <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "24px" }}>
              <a href="#" style={{ fontSize: "13px", color: "#d4841a", textDecoration: "none", fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            <button className="btn-login" onClick={login} disabled={loading}>
              <span className="btn-content">
                {loading ? (
                  <><div className="spinner" /> Signing in…</>
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

            <div className="form-divider">or</div>

            <p className="form-footnote">
              Don&apos;t have an account?{" "}
              <a href="#">Request access</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
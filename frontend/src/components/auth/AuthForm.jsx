import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/hooks";
import ThemeSwitch from "../ui/ThemeSwitch";
import AnimatedBackground from "../ui/AnimatedBackground";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "", remember: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  }

  function validate() {
    const next = {};
    if (isSignup && values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (isSignup && values.confirmPassword !== values.password) next.confirmPassword = "Those passwords don’t match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isSignup) signup(values);
      else login(values.email, values.password, values.remember);
      navigate("/dashboard", { replace: true, state: { showWelcome: true } });
    } catch (error) {
      setErrors({ form: error.message });
      setSubmitting(false);
    }
  }

  return (
    <>
      <AnimatedBackground />
      <div className="auth-page">
      <header className="auth-header"><Link className="brand" to="/"><span className="brand-mark">p.</span><span>pocketwise</span></Link><div><span className="auth-header-note">A calmer way to money</span><ThemeSwitch /></div></header>
      <main className="auth-main">
        <div className="auth-visual">
          <span className="auth-sparkle">✳</span><span className="eyebrow">MAKE ROOM FOR WHAT MATTERS</span>
          <h2>Good with money<br />looks good on you.</h2>
          <p>One clear view of your spending, saving, and all the little wins in between.</p>
          <div className="auth-mini-card"><div><span>Monthly savings</span><strong>₹24,850</strong></div><span className="mini-trend">↗ 18.4%</span><div className="mini-bars">{[34, 51, 42, 70, 58, 78, 96].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><div className="mini-months"><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div></div>
          <small className="auth-note">Your data stays yours. Always.</small>
        </div>
        <section className="auth-card">
          <div className="auth-card-top"><span className="eyebrow">{isSignup ? "A FRESH START" : "WELCOME BACK"}</span><span className="auth-step">{isSignup ? "01 / 01" : "✦"}</span></div>
          <h1>{isSignup ? "Create your account" : "Good to see you."}</h1>
          <p className="auth-description">{isSignup ? "Start building a more intentional money routine." : "Pick up right where you left off."}</p>
          <form onSubmit={submit} noValidate>
            {isSignup && <Field label="Your name" error={errors.name}><input autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Aanya Sharma" /></Field>}
            <Field label="Email address" error={errors.email}><input type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></Field>
            <Field label="Password" error={errors.password}><div className="password-field"><input type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} value={values.password} onChange={(event) => update("password", event.target.value)} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></Field>
            {isSignup && <Field label="Confirm password" error={errors.confirmPassword}><input type={showPassword ? "text" : "password"} autoComplete="new-password" value={values.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder="Type it again" /></Field>}
            {!isSignup && <label className="remember-row"><input type="checkbox" checked={values.remember} onChange={(event) => update("remember", event.target.checked)} /> <span>Remember me</span><button type="button" className="text-link" onClick={() => setErrors({ form: "This local demo doesn’t send password reset emails." })}>Forgot password?</button></label>}
            {errors.form && <p className="form-error" role="alert">{errors.form}</p>}
            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>{isSignup ? "Create account" : "Log in"} <span aria-hidden="true">↗</span></button>
          </form>
          {!isSignup && <button className="demo-login" onClick={() => { setValues({ ...values, email: "demo@pocketwise.app", password: "demo1234" }); setErrors({}); }}>Try the demo account <span>· demo@pocketwise.app</span></button>}
          <p className="auth-switch">{isSignup ? "Already have an account?" : "New to Pocketwise?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link></p>
          {isSignup && <p className="auth-production-note">This demo stores credentials locally for testing only. Production authentication requires a backend, hashed passwords, and secure JWT/session handling.</p>}
        </section>
      </main>
      <footer className="auth-footer">© 2026 Pocketwise <span>•</span> Made for a little more peace of mind.</footer>
      </div>
    </>
  );
}

function Field({ label, error, children }) {
  return <label className="field auth-field"><span>{label}</span>{children}{error && <small className="field-error" role="alert">{error}</small>}</label>;
}

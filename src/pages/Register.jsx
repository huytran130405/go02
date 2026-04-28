import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/register.css';

// ============================================================
// ICONS
// ============================================================
// ForumIcon không còn dùng (thay bằng Font Awesome)


const EyeOpenIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

// ============================================================
// VALIDATION HELPERS
// ============================================================
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ============================================================
// MAIN COMPONENT
// ============================================================
function Register() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // ----------------------------------------------------------------
  // Password strength checker
  // ----------------------------------------------------------------
  const getPasswordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { level: 'weak', label: 'Weak', color: '#ef4444', width: '33%' };
    if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
      return { level: 'medium', label: 'Medium', color: '#f59e0b', width: '66%' };
    return { level: 'strong', label: 'Strong', color: '#22c55e', width: '100%' };
  };
  const strength = getPasswordStrength(password);

  // ----------------------------------------------------------------
  // Validate form
  // ----------------------------------------------------------------
  const validate = () => {
    const errs = {};
    if (!userName.trim())
      errs.userName = 'Username is required.';
    else if (userName.trim().length < 3)
      errs.userName = 'Username must be at least 3 characters.';

    if (!email.trim())
      errs.email = 'Email is required.';
    else if (!isValidEmail(email))
      errs.email = 'Invalid email format (e.g. name@email.com).';

    if (!password)
      errs.password = 'Password is required.';
    else if (password.length < 6)
      errs.password = 'Password must be at least 6 characters.';

    if (!confirmPassword)
      errs.confirmPassword = 'Please confirm your password.';
    else if (confirmPassword !== password)
      errs.confirmPassword = 'Passwords do not match.';

    return errs;
  };

  // ----------------------------------------------------------------
  // Handle Submit
  // ----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);

    // Giả lập gọi API đăng ký (600ms)
    await new Promise((res) => setTimeout(res, 600));

    // Mock: kiểm tra email đã tồn tại
    const { MOCK_USERS } = await import('../data/users.js');
    const exists = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      setErrors({ email: 'This email is already registered. Please use another email.' });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccessMsg(`Registration successful! Welcome, ${userName} 🎉`);

    // Auto redirect to Login after 2 seconds
    setTimeout(() => navigate('/login'), 2000);
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div className="register-page">

      {/* ===== HEADER ===== */}
      <header className="register-header">
        <div className="register-header-left">
          <Link to="/" className="register-logo">
            <div className="register-logo-icon">
              <i className="fa-solid fa-f"></i>
            </div>
            <h2 className="register-logo-text">ForumHub</h2>
          </Link>
          <nav className="register-nav">
            <Link to="/" className="register-nav-link">Home</Link>
            <Link to="/login" className="register-nav-link">Login</Link>
          </nav>
        </div>
      </header>

      {/* ===== MAIN: Split Layout ===== */}
      <main className="register-main">

        {/* LEFT: Illustration */}
        <section className="register-left-section">
          <div style={{ maxWidth: 400, textAlign: 'center', marginBottom: 32 }}>
            <h1 className="register-left-title">
              Join us today!
            </h1>
            <p className="register-left-sub">
              Create a free account and start<br />sharing knowledge with the community.
            </p>
          </div>
          {/* Benefits list */}
          <div className="register-benefits-list">
            {[
              'Post & share your knowledge',
              'Comment and engage with the community',
              'Get notified about new posts',
              'Personal profile with post statistics',
            ].map((benefit, i) => (
              <div key={i} className="register-benefit-item">
                <div className="register-benefit-icon">
                  <CheckIcon />
                </div>
                <span className="register-benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: Register Form */}
        <section className="register-right-section">
          <div className="register-form-wrapper">
            <h2 className="register-title">
              Create a new account
            </h2>
            <p className="register-subtitle">
              Fill in the details below to get started
            </p>

            {/* Thông báo thành công */}
            {successMsg && (
              <div className="register-success-box" role="status">
                <span style={{ fontSize: 18 }}>✅</span>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="register-form">

              {/* === Username === */}
              <div>
                <label htmlFor="reg-username" className="register-label">Username</label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Enter your display name"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) setErrors((p) => ({ ...p, userName: undefined }));
                  }}
                  className={`register-input${errors.userName ? ' input-error' : ''}`}
                />
                {errors.userName && <p className="register-error-text">{errors.userName}</p>}
              </div>

              {/* === Email === */}
              <div>
                <label htmlFor="reg-email" className="register-label">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  className={`register-input${errors.email ? ' input-error' : ''}`}
                />
                {errors.email && <p className="register-error-text">{errors.email}</p>}
              </div>

              {/* === Password === */}
              <div>
                <label htmlFor="reg-password" className="register-label">Password</label>
                <div className="register-password-wrapper">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    className={`register-input register-input-password${errors.password ? ' input-error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="register-eye-btn">
                    {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {/* Password strength bar */}
                {strength && (
                  <div style={{ marginTop: 6 }}>
                    <div className="register-strength-bar-bg">
                      <div className="register-strength-bar-fill" style={{ width: strength.width, background: strength.color }} />
                    </div>
                    <p className="register-strength-label" style={{ color: strength.color }}>
                      Strength: {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && <p className="register-error-text">{errors.password}</p>}
              </div>

              {/* === Confirm Password === */}
              <div>
                <label htmlFor="reg-confirm" className="register-label">Confirm Password</label>
                <div className="register-password-wrapper">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
                    }}
                    className={`register-input register-input-password${errors.confirmPassword ? ' input-error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="register-eye-btn">
                    {showConfirm ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="register-error-text">{errors.confirmPassword}</p>}
              </div>

              {/* === Submit === */}
              <button
                type="submit"
                disabled={isLoading || !!successMsg}
                className="register-submit-btn"
              >
                {isLoading ? (
                  <span className="register-loading-row">
                    <span className="register-spinner" /> Creating account...
                  </span>
                ) : 'Create account'}
              </button>
            </form>

            <p className="register-signin-text">
              Already have an account?{' '}
              <Link to="/login" className="register-signin-link">
                Sign in
              </Link>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Register;

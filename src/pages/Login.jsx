import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Kiểm tra định dạng email hợp lệ
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate toàn bộ form, trả về object errors
 */
function validateForm(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format (e.g., user@example.com).';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

// ============================================================
// ICONS (inline SVG để không cần thêm thư viện)
// ============================================================

const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const ForumIcon = () => null; // không còn dùng, giữ lại để tránh lỗi nếu còn ref


// ============================================================
// MAIN COMPONENT
// ============================================================

function Login() {
  const navigate = useNavigate();

  // --- State quản lý form inputs ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // --- State UI ---
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});       // Lỗi validation từng trường
  const [apiError, setApiError] = useState('');   // Lỗi từ server/API
  const [isLoading, setIsLoading] = useState(false);

  // Lấy hàm login từ AuthContext
  const { login } = useAuth();

  // ----------------------------------------------------------------
  // Xử lý submit form
  // ----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); // Reset lỗi API cũ

    // 1. Validate client-side
    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // 2. Gọi hàm login từ Context
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Đăng nhập thành công → điều hướng về trang chủ
        navigate('/');
      } else {
        setApiError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setApiError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Xử lý đăng nhập Google (Mô phỏng)
  // ----------------------------------------------------------------
  const handleGoogleLogin = async () => {
    const googleEmail = prompt("Please enter your Google Email to login:", "user.google@gmail.com");

    if (googleEmail) {
      if (!isValidEmail(googleEmail)) {
        alert("Invalid email!");
        return;
      }

      setIsLoading(true);
      // Gọi hàm login từ context với mật khẩu giả lập
      const result = await login(googleEmail, "google-auth-pass");
      if (result.success) {
        navigate('/');
      } else {
        setApiError("Google login failed.");
      }
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Xóa lỗi khi người dùng bắt đầu gõ lại
  // ----------------------------------------------------------------
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (apiError) setApiError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (apiError) setApiError('');
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div className="login-page">

      {/* ===== HEADER / NAVBAR ===== */}
      <header className="login-header">
        <div className="login-header-left">
          {/* Logo */}
          <Link to="/" className="login-logo">
            <div className="login-logo-icon">
              <i className="fa-solid fa-f"></i>
            </div>
            <h2 className="login-logo-text">ForumHub</h2>
          </Link>
          {/* Nav Links */}
          <nav className="login-nav">
            <Link to="/" className="login-nav-link">Home</Link>
            <Link to="/create-post" className="login-nav-link">Create Post</Link>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="login-main">

        {/* LEFT: Minh họa + Welcome text */}
        <section className="login-left-section">
          <div style={{ maxWidth: 400, textAlign: 'center', marginBottom: 32, zIndex: 1 }}>
            <h1 className="login-welcome-title">
              Welcome back!
            </h1>
            <p className="login-welcome-sub">
              Login to your account to continue<br />joining the conversation.
            </p>
          </div>
          {/* Hình minh họa */}
          <div style={{ width: '100%', maxWidth: 420 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBArmkKDxSOuVqn34Z6i7je0a8-rTbK2Yx9OW64KjejKTndkQgd73il8WVvtcwgUuh4lpb-HKvI_v1wrR-nZWI-u8yxoqcG1XlEoRXsb4Zoj-ywz95d6E9jXvf1Zg6ihvBNyQIaQCAM43Yk3nlDOrWR-Vs9qxIr10yJw0wfSI3QYHbq-VPjGd7ChjupfcHtYquAvtfrOGpmjFoPLRPFc2H6xp3cwHTx6Cj74VT0vI6l9kP9tIRolA2ZvHM0yZnvJZOo_cnzRNxlhzm5"
              alt="Welcome Illustration"
              className="login-illustration"
              onError={(e) => { e.target.style.display = 'none'; }} // Ẩn nếu lỗi load ảnh
            />
          </div>
        </section>

        {/* RIGHT: Login Form */}
        <section className="login-right-section">
          <div className="login-form-wrapper">
            <h2 className="login-title">
              Login to your account
            </h2>

            {/* Hiển thị lỗi API */}
            {apiError && (
              <div className="login-api-error-box" role="alert">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="login-field-group">

              {/* === Email Field === */}
              <div>
                <label htmlFor="login-email" className="login-label">Email</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`login-input${errors.email ? ' input-error' : ''}`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p id="email-error" className="login-error-text" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* === Password Field === */}
              <div>
                <label htmlFor="login-password" className="login-label">Password</label>
                <div className="login-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`login-input login-input-password${errors.password ? ' input-error' : ''}`}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  {/* Toggle hiện/ẩn mật khẩu */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="login-eye-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="login-error-text" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* === Remember Me & Forgot Password === */}
              <div className="login-remember-row">
                <label className="login-remember-label">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-remember-checkbox"
                  />
                  Remember me
                </label>
                <a href="#" className="login-forgot-link">
                  Forgot password?
                </a>
              </div>

              {/* === Login Button === */}
              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn"
              >
                {isLoading ? (
                  <span className="login-loading-row">
                    <span className="login-spinner" />
                    Logging in...
                  </span>
                ) : 'Login'}
              </button>

            </form>

            {/* === Divider === */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line" />
            </div>

            {/* === Google Login === */}
            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              Login with Google
            </button>

            {/* === Sign Up Link === */}
            <p className="login-signup-text">
              Don't have an account?{' '}
              <Link to="/register" className="login-signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Login;

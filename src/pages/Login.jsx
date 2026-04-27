import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    errors.email = 'Email không được để trống.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email không đúng định dạng (ví dụ: user@example.com).';
  }

  if (!password) {
    errors.password = 'Mật khẩu không được để trống.';
  } else if (password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
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

const ForumIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM7 11C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9C7.55 9 8 9.45 8 10C8 10.55 7.55 11 7 11ZM12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11ZM17 11C16.45 11 16 10.55 16 10C16 9.45 16.45 9 17 9C17.55 9 18 9.45 18 10C18 10.55 17.55 11 17 11Z" />
  </svg>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

function Login({ onNavigate }) {
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
        if (onNavigate) onNavigate('home');
      } else {
        setApiError(result.error || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    } catch (err) {
      setApiError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Xử lý đăng nhập Google (Mô phỏng)
  // ----------------------------------------------------------------
  const handleGoogleLogin = async () => {
    const googleEmail = prompt("Vui lòng nhập Email Google của bạn để đăng nhập:", "user.google@gmail.com");

    if (googleEmail) {
      if (!isValidEmail(googleEmail)) {
        alert("Email không hợp lệ!");
        return;
      }

      setIsLoading(true);
      // Gọi hàm login từ context với mật khẩu giả lập
      const result = await login(googleEmail, "google-auth-pass");
      if (result.success) {
        onNavigate?.('home');
      } else {
        setApiError("Đăng nhập Google thất bại.");
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
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: '#fff', overflow: 'hidden' }}>

      {/* ===== HEADER / NAVBAR ===== */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Logo */}
          <a href="#" style={styles.logo} onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
            <div style={styles.logoIcon}>
              <ForumIcon />
            </div>
            ForumHub
          </a>
          {/* Nav Links */}
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>Home</a>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); onNavigate?.('create-post'); }}>Create Post</a>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main style={styles.main}>

        {/* LEFT: Minh họa + Welcome text */}
        <section className="login-left-section" style={styles.leftSection}>
          <div style={{ maxWidth: 400, textAlign: 'center', marginBottom: 32, zIndex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>
              Welcome back!
            </h1>
            <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.6 }}>
              Login to your account to continue<br />joining the conversation.
            </p>
          </div>
          {/* Hình minh họa */}
          <div style={{ width: '100%', maxWidth: 420 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBArmkKDxSOuVqn34Z6i7je0a8-rTbK2Yx9OW64KjejKTndkQgd73il8WVvtcwgUuh4lpb-HKvI_v1wrR-nZWI-u8yxoqcG1XlEoRXsb4Zoj-ywz95d6E9jXvf1Zg6ihvBNyQIaQCAM43Yk3nlDOrWR-Vs9qxIr10yJw0wfSI3QYHbq-VPjGd7ChjupfcHtYquAvtfrOGpmjFoPLRPFc2H6xp3cwHTx6Cj74VT0vI6l9kP9tIRolA2ZvHM0yZnvJZOo_cnzRNxlhzm5"
              alt="Welcome Illustration"
              style={{ width: '100%', borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
              onError={(e) => { e.target.style.display = 'none'; }} // Ẩn nếu lỗi load ảnh
            />
          </div>
        </section>

        {/* RIGHT: Login Form */}
        <section style={styles.rightSection}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 32 }}>
              Login to your account
            </h2>

            {/* Hiển thị lỗi API */}
            {apiError && (
              <div style={styles.apiErrorBox} role="alert">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* === Email Field === */}
              <div>
                <label htmlFor="login-email" style={styles.label}>Email</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {}),
                  }}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p id="email-error" style={styles.errorText} role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* === Password Field === */}
              <div>
                <label htmlFor="login-password" style={styles.label}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{
                      ...styles.input,
                      paddingRight: 44,
                      ...(errors.password ? styles.inputError : {}),
                    }}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  {/* Toggle hiện/ẩn mật khẩu */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeBtn}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" style={styles.errorText} role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* === Remember Me & Forgot Password === */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#1a73e8', cursor: 'pointer' }}
                  />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: 14, color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot password?
                </a>
              </div>

              {/* === Login Button === */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitBtn,
                  opacity: isLoading ? 0.75 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={styles.spinner} />
                    Đang đăng nhập...
                  </span>
                ) : 'Login'}
              </button>

            </form>

            {/* === Divider === */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>

            {/* === Google Login === */}
            <button
              type="button"
              style={styles.googleBtn}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              Login with Google
            </button>

            {/* === Sign Up Link === */}
            <p style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
              Don't have an account?{' '}
              <a
                href="#"
                style={{ color: '#1a73e8', fontWeight: 600, textDecoration: 'none' }}
                onClick={(e) => { e.preventDefault(); onNavigate?.('register'); }}
              >
                Sign up
              </a>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

// ============================================================
// STYLES (inline styles - không cần Tailwind/CSS module)
// ============================================================
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 20,
    fontWeight: 700,
    color: '#1f2937',
    textDecoration: 'none',
  },
  logoIcon: {
    width: 32,
    height: 32,
    background: '#2563eb',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  nav: {
    display: 'flex',
    gap: 24,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    textDecoration: 'none',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  searchInput: {
    padding: '8px 40px 8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    width: 240,
    outline: 'none',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 18,
    height: 18,
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  loginBtn: {
    padding: '8px 20px',
    border: '1px solid #2563eb',
    borderRadius: 6,
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'background 0.15s',
  },
  main: {
    display: 'flex',
    flex: 1,              // Chiếm toàn bộ chiều cao còn lại
    overflow: 'hidden',
    minHeight: 0,         // Quan trọng: cho phép flex child co lại đúng cách
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    background: '#E6F0FF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'stretch', // Stretch chiều cao theo container
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    background: '#fff',
    alignSelf: 'stretch', // Stretch chiều cao theo container
    overflowY: 'auto',
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
    color: '#ef4444',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    transition: 'background 0.15s',
    fontFamily: 'inherit',
  },
  apiErrorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 16,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '12px 16px',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontFamily: 'inherit',
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.6s linear infinite',
  },
};

// CSS cho spinner animation và reset
if (typeof document !== 'undefined' && !document.getElementById('login-page-styles')) {
  const s = document.createElement('style');
  s.id = 'login-page-styles';
  s.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .login-submit-btn:hover:not(:disabled) { background: #1557b0 !important; }
    .login-google-btn:hover { background: #f9fafb !important; }
    input:focus { border-color: #1a73e8 !important; box-shadow: 0 0 0 3px rgba(26,115,232,0.15) !important; }
  `;
  document.head.appendChild(s);
}

export default Login;

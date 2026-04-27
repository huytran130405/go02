import { useState } from 'react';

// ============================================================
// ICONS
// ============================================================
const ForumIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM7 11C6.45 11 6 10.55 6 10S6.45 9 7 9 8 9.45 8 10 7.55 11 7 11ZM12 11C11.45 11 11 10.55 11 10S11.45 9 12 9 13 9.45 13 10 12.55 11 12 11ZM17 11C16.45 11 16 10.55 16 10S16.45 9 17 9 18 9.45 18 10 17.55 11 17 11Z" />
  </svg>
);

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
function Register({ onNavigate }) {
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
    if (pw.length < 6) return { level: 'weak', label: 'Yếu', color: '#ef4444', width: '33%' };
    if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
      return { level: 'medium', label: 'Trung bình', color: '#f59e0b', width: '66%' };
    return { level: 'strong', label: 'Mạnh', color: '#22c55e', width: '100%' };
  };
  const strength = getPasswordStrength(password);

  // ----------------------------------------------------------------
  // Validate form
  // ----------------------------------------------------------------
  const validate = () => {
    const errs = {};
    if (!userName.trim())
      errs.userName = 'Tên người dùng không được để trống.';
    else if (userName.trim().length < 3)
      errs.userName = 'Tên người dùng cần ít nhất 3 ký tự.';

    if (!email.trim())
      errs.email = 'Email không được để trống.';
    else if (!isValidEmail(email))
      errs.email = 'Email không đúng định dạng (vd: name@email.com).';

    if (!password)
      errs.password = 'Mật khẩu không được để trống.';
    else if (password.length < 6)
      errs.password = 'Mật khẩu cần ít nhất 6 ký tự.';

    if (!confirmPassword)
      errs.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    else if (confirmPassword !== password)
      errs.confirmPassword = 'Mật khẩu nhập lại không khớp.';

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
      setErrors({ email: 'Email này đã được đăng ký. Vui lòng dùng email khác.' });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccessMsg(`Đăng ký thành công! Chào mừng ${userName} 🎉`);

    // Tự động chuyển sang Login sau 2 giây
    setTimeout(() => onNavigate?.('login'), 2000);
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: '#fff', overflow: 'hidden' }}>

      {/* ===== HEADER ===== */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <a href="#" style={styles.logo} onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
            <div style={styles.logoIcon}><ForumIcon /></div>
            ForumHub
          </a>
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>Home</a>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); onNavigate?.('login'); }}>Login</a>
          </nav>
        </div>
      </header>

      {/* ===== MAIN: Split Layout ===== */}
      <main style={styles.main}>

        {/* LEFT: Illustration */}
        <section style={styles.leftSection}>
          <div style={{ maxWidth: 400, textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>
              Join us today!
            </h1>
            <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.6 }}>
              Tạo tài khoản miễn phí và bắt đầu<br />chia sẻ kiến thức với cộng đồng.
            </p>
          </div>
          {/* Benefits list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
            {[
              'Đăng bài & chia sẻ kiến thức',
              'Bình luận và tương tác cộng đồng',
              'Nhận thông báo bài viết mới',
              'Hồ sơ cá nhân với thống kê bài đăng',
            ].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <CheckIcon />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: Register Form */}
        <section style={styles.rightSection}>
          <div style={{ width: '100%', maxWidth: 440 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>
              Tạo tài khoản mới
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>
              Điền thông tin bên dưới để đăng ký
            </p>

            {/* Thông báo thành công */}
            {successMsg && (
              <div style={styles.successBox} role="status">
                <span style={{ fontSize: 18 }}>✅</span>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* === Username === */}
              <div>
                <label htmlFor="reg-username" style={styles.label}>Tên người dùng</label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Nhập tên hiển thị của bạn"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) setErrors((p) => ({ ...p, userName: undefined }));
                  }}
                  style={{ ...styles.input, ...(errors.userName ? styles.inputError : {}) }}
                />
                {errors.userName && <p style={styles.errorText}>{errors.userName}</p>}
              </div>

              {/* === Email === */}
              <div>
                <label htmlFor="reg-email" style={styles.label}>Email</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                />
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              {/* === Password === */}
              <div>
                <label htmlFor="reg-password" style={styles.label}>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ít nhất 6 ký tự"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    style={{ ...styles.input, paddingRight: 44, ...(errors.password ? styles.inputError : {}) }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {/* Password strength bar */}
                {strength && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 4, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: strength.width, height: '100%', background: strength.color, borderRadius: 4, transition: 'width 0.3s, background 0.3s' }} />
                    </div>
                    <p style={{ fontSize: 11, color: strength.color, marginTop: 3, fontWeight: 600 }}>
                      Độ mạnh: {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && <p style={styles.errorText}>{errors.password}</p>}
              </div>

              {/* === Confirm Password === */}
              <div>
                <label htmlFor="reg-confirm" style={styles.label}>Nhập lại mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu bên trên"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
                    }}
                    style={{ ...styles.input, paddingRight: 44, ...(errors.confirmPassword ? styles.inputError : {}) }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    {showConfirm ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
              </div>

              {/* === Submit === */}
              <button
                type="submit"
                disabled={isLoading || !!successMsg}
                style={{ ...styles.submitBtn, opacity: (isLoading || !!successMsg) ? 0.75 : 1, cursor: (isLoading || !!successMsg) ? 'not-allowed' : 'pointer', marginTop: 6 }}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={styles.spinner} /> Đang đăng ký...
                  </span>
                ) : 'Tạo tài khoản'}
              </button>
            </form>

            <p style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
              Đã có tài khoản?{' '}
              <a
                href="#"
                style={{ color: '#1a73e8', fontWeight: 600, textDecoration: 'none' }}
                onClick={(e) => { e.preventDefault(); onNavigate?.('login'); }}
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

// ============================================================
// STYLES — nhất quán với Login.jsx
// ============================================================
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 32 },
  logo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, color: '#1f2937', textDecoration: 'none' },
  logoIcon: { width: 32, height: 32, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  nav: { display: 'flex', gap: 24 },
  navLink: { fontSize: 14, fontWeight: 500, color: '#374151', textDecoration: 'none' },

  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    background: '#EEF4FF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    background: '#fff',
    alignSelf: 'stretch',
    overflowY: 'auto',
  },

  label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 },
  input: {
    width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 6,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
  },
  inputError: { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' },
  errorText: { marginTop: 4, fontSize: 13, color: '#ef4444' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
    display: 'flex', alignItems: 'center', padding: 0,
  },
  submitBtn: {
    width: '100%', padding: '12px 16px', background: '#1a73e8', color: '#fff',
    border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600,
    transition: 'background 0.15s', fontFamily: 'inherit',
  },
  successBox: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
    background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8,
    fontSize: 14, color: '#15803d', marginBottom: 20, fontWeight: 500,
  },
  spinner: {
    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block', animation: 'spin 0.6s linear infinite',
  },
};

// Inject CSS animation
if (typeof document !== 'undefined' && !document.getElementById('register-page-styles')) {
  const s = document.createElement('style');
  s.id = 'register-page-styles';
  s.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    #reg-username:focus, #reg-email:focus, #reg-password:focus, #reg-confirm:focus {
      border-color: #1a73e8 !important;
      box-shadow: 0 0 0 3px rgba(26,115,232,0.15) !important;
    }
  `;
  document.head.appendChild(s);
}

export default Register;

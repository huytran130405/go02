import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// ============================================================
// ICONS (inline SVG)
// ============================================================

const ForumIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM7 11C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9C7.55 9 8 9.45 8 10C8 10.55 7.55 11 7 11ZM12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11ZM17 11C16.45 11 16 10.55 16 10C16 9.45 16.45 9 17 9C17.55 9 18 9.45 18 10C18 10.55 17.55 11 17 11Z"/>
  </svg>
);

const SearchIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
  </svg>
);

// ============================================================
// TOOLBAR BUTTON component
// ============================================================
function ToolbarButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={toolbarBtnStyle}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#111'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
    >
      {children}
    </button>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function CreatePost({ onNavigate }) {
  // Lấy thông tin user từ Context để kiểm tra đăng nhập
  const { user, isLoggedIn, logout } = useAuth();

  // --- Form state ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Ref đến textarea để áp dụng định dạng
  const textareaRef = useRef(null);

  // ----------------------------------------------------------------
  // Validate form
  // ----------------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Tiêu đề cần ít nhất 5 ký tự.';
    }
    if (!content.trim()) {
      newErrors.content = 'Nội dung không được để trống.';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Nội dung cần ít nhất 10 ký tự.';
    }
    return newErrors;
  };

  // ----------------------------------------------------------------
  // Xử lý submit
  // ----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    try {
      // Mô phỏng gọi API tạo post
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Thành công
      setSuccessMsg(`Bài viết "${title}" đã được đăng thành công!`);
      setTitle('');
      setContent('');
    } catch (err) {
      setErrors({ api: 'Đã có lỗi xảy ra khi đăng bài. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------
  // Toolbar actions: chèn Markdown formatting vào textarea
  // ----------------------------------------------------------------
  const insertFormat = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    // Đặt lại cursor vào sau vùng được format
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length + (selected || 'text').length + suffix.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  // ----------------------------------------------------------------
  // RENDER: Nếu chưa đăng nhập → hiển thị thông báo yêu cầu login
  // ----------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: '#f6f7f9', overflow: 'hidden' }}>
        <Navbar user={user} isLoggedIn={isLoggedIn} onNavigate={onNavigate} onLogout={logout} activePage="create-post" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={styles.notLoggedInCard}>
            {/* Icon khóa */}
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>
              Bạn cần đăng nhập
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 24, textAlign: 'center', lineHeight: 1.6 }}>
              Chỉ thành viên đã đăng nhập mới có thể tạo bài viết.<br />
              Vui lòng đăng nhập để tiếp tục.
            </p>
            <button
              style={styles.loginRedirectBtn}
              onClick={() => onNavigate?.('login')}
            >
              Đăng nhập ngay
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // RENDER: Đã đăng nhập → hiển thị form tạo bài
  // ----------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: '#f6f7f9', overflow: 'hidden' }}>

      <Navbar user={user} isLoggedIn={isLoggedIn} onNavigate={onNavigate} onLogout={logout} activePage="create-post" />

      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 60px' }}>
        <div style={styles.card}>

          <h1 style={styles.pageTitle}>Create New Post</h1>

          {/* Thông báo thành công */}
          {successMsg && (
            <div style={styles.successBox} role="status">
              <span>✅</span> {successMsg}
            </div>
          )}

          {/* Lỗi API */}
          {errors.api && (
            <div style={styles.apiErrorBox} role="alert">
              <span>⚠️</span> {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* === Title Input === */}
            <div>
              <label htmlFor="post-title" style={styles.label}>Title</label>
              <input
                id="post-title"
                type="text"
                name="post-title"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                  if (successMsg) setSuccessMsg('');
                }}
                style={{
                  ...styles.input,
                  ...(errors.title ? styles.inputError : {}),
                }}
                aria-describedby={errors.title ? 'title-error' : undefined}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p id="title-error" style={styles.errorText} role="alert">{errors.title}</p>
              )}
            </div>

            {/* === Content Rich-Text Editor === */}
            <div>
              <label htmlFor="post-content" style={styles.label}>Content</label>
              <div style={{
                ...styles.editorWrapper,
                ...(errors.content ? styles.editorWrapperError : {}),
              }}>

                {/* Toolbar */}
                <div style={styles.toolbar}>
                  <ToolbarButton title="Bold" onClick={() => insertFormat('**', '**')}>
                    <strong>B</strong>
                  </ToolbarButton>
                  <ToolbarButton title="Italic" onClick={() => insertFormat('_', '_')}>
                    <em>I</em>
                  </ToolbarButton>
                  <div style={styles.toolbarDivider} />
                  <ToolbarButton title="Unordered List" onClick={() => insertFormat('\n- ', '')}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                  </ToolbarButton>
                  <ToolbarButton title="Ordered List" onClick={() => insertFormat('\n1. ', '')}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </ToolbarButton>
                  <div style={styles.toolbarDivider} />
                  <ToolbarButton title="Link" onClick={() => insertFormat('[', '](url)')}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                  </ToolbarButton>
                </div>

                {/* Textarea */}
                <textarea
                  id="post-content"
                  ref={textareaRef}
                  name="post-content"
                  placeholder="Write your content here..."
                  value={content}
                  rows={10}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                    if (successMsg) setSuccessMsg('');
                  }}
                  style={styles.textarea}
                  aria-describedby={errors.content ? 'content-error' : undefined}
                  aria-invalid={!!errors.content}
                />
              </div>
              {errors.content && (
                <p id="content-error" style={styles.errorText} role="alert">{errors.content}</p>
              )}
            </div>

            {/* === Submit Button === */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...styles.publishBtn,
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={spinnerStyle} /> Đang đăng...
                  </span>
                ) : 'Publish Post'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// NAVBAR Component (dùng chung, hiển thị khác nhau khi login/logout)
// ============================================================
function Navbar({ user, isLoggedIn, onNavigate, onLogout, activePage }) {
  return (
    <header style={navStyles.header}>
      <div style={navStyles.inner}>
        <div style={navStyles.left}>
          {/* Logo */}
          <a href="#" style={navStyles.logo} onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
            <span style={navStyles.logoText}>ForumHub</span>
          </a>
          {/* Nav */}
          <nav style={navStyles.nav}>
            <a
              href="#"
              style={{ ...navStyles.navLink, ...(activePage === 'home' ? navStyles.navLinkActive : {}) }}
              onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}
            >
              Home
            </a>
            <a
              href="#"
              style={{ ...navStyles.navLink, ...(activePage === 'create-post' ? navStyles.navLinkActive : {}) }}
              onClick={(e) => { e.preventDefault(); onNavigate?.('create-post'); }}
            >
              Create Post
            </a>
          </nav>
        </div>

        <div style={navStyles.right}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input style={navStyles.searchInput} type="text" placeholder="Search posts..." />
            <span style={navStyles.searchIcon}><SearchIcon /></span>
          </div>

          {/* Auth button: hiện Login hoặc thông tin user */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div style={navStyles.avatar} title={user?.email}>
                {user?.avatar || '?'}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
                {user?.name}
              </span>
              <button
                style={navStyles.logoutBtn}
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              style={navStyles.loginBtn}
              onClick={() => onNavigate?.('login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ============================================================
// STYLES
// ============================================================
const toolbarBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#6b7280',
  padding: '4px 8px',
  borderRadius: 4,
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.1s, color 0.1s',
};

const spinnerStyle = {
  width: 14,
  height: 14,
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: '#fff',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'spin 0.6s linear infinite',
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    width: '100%',
    maxWidth: 860,      // Mở rộng lên 860px
    padding: '48px 56px', // Tăng padding
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.02em',
    marginBottom: 32,
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  inputError: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239,68,68,0.1)',
  },
  editorWrapper: {
    border: '1px solid #d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  editorWrapperError: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239,68,68,0.1)',
  },
  toolbar: {
    background: '#f8f9fa',
    borderBottom: '1px solid #e5e7eb',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  toolbarDivider: {
    width: 1,
    height: 16,
    background: '#d1d5db',
    margin: '0 4px',
  },
  textarea: {
    width: '100%',
    border: 'none',
    padding: '12px 12px',
    fontSize: 14,
    color: '#111827',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    boxSizing: 'border-box',
    minHeight: 200,
  },
  publishBtn: {
    padding: '10px 40px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    transition: 'background 0.15s',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#ef4444',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 6,
    fontSize: 14,
    color: '#15803d',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  notLoggedInCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '48px 40px',
    maxWidth: 440,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginRedirectBtn: {
    padding: '12px 32px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontFamily: 'inherit',
  },
};

const navStyles = {
  header: {
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    width: '100%',
  },
  inner: {
    maxWidth: '100%',   // Mở rộng navbar full
    margin: '0 auto',
    padding: '0 48px',  // Tăng padding hai bên
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    textDecoration: 'none',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    gap: 24,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 500,
    color: '#6b7280',
    textDecoration: 'none',
    paddingBottom: 2,
  },
  navLinkActive: {
    color: '#111827',
    borderBottom: '3px solid #111827',
    paddingBottom: 2,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  searchInput: {
    padding: '6px 10px 6px 32px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    width: 240,
    outline: 'none',
    background: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  loginBtn: {
    padding: '6px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    color: '#374151',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  },
  logoutBtn: {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    color: '#374151',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
};

// Inject CSS cho animations
if (typeof document !== 'undefined' && !document.getElementById('create-post-styles')) {
  const s = document.createElement('style');
  s.id = 'create-post-styles';
  s.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    #post-title:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.15) !important; }
  `;
  document.head.appendChild(s);
}

export default CreatePost;

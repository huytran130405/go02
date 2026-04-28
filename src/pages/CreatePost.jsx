import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import '../styles/createPost.css';

// ============================================================
// TOOLBAR BUTTON component
// ============================================================
function ToolbarButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="cp-toolbar-btn"
    >
      {children}
    </button>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function CreatePost() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

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
      newErrors.title = 'Title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required.';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters.';
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
      setSuccessMsg(`Post "${title}" has been published successfully!`);
      setTitle('');
      setContent('');
    } catch (err) {
      setErrors({ api: 'An error occurred while publishing. Please try again.' });
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
  // RENDER: Nếu chưa đăng nhập → thông báo yêu cầu login
  // ----------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="cp-not-logged-in-wrapper">
          <div className="cp-not-logged-in-card">
            <div className="cp-not-logged-in-icon">🔒</div>
            <h2 className="cp-not-logged-in-title">Login Required</h2>
            <p className="cp-not-logged-in-desc">
              Only logged-in members can create posts.<br />
              Please login to continue.
            </p>
            <button
              className="cp-login-redirect-btn"
              onClick={() => navigate('/login')}
            >
              Login now
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ----------------------------------------------------------------
  // RENDER: Đã đăng nhập → hiển thị form tạo bài
  // ----------------------------------------------------------------
  return (
    <MainLayout>
      <div className="create-post-card">

        <h1 className="create-post-page-title">Create New Post</h1>

        {/* Thông báo thành công */}
        {successMsg && (
          <div className="cp-success-box" role="status">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* Lỗi API */}
        {errors.api && (
          <div className="cp-api-error-box" role="alert">
            <span>⚠️</span> {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="create-post-form">

          {/* === Title Input === */}
          <div>
            <label htmlFor="post-title" className="cp-label">Title</label>
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
              className={`cp-input${errors.title ? ' input-error' : ''}`}
              aria-describedby={errors.title ? 'title-error' : undefined}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p id="title-error" className="cp-error-text" role="alert">{errors.title}</p>
            )}
          </div>

          {/* === Content Rich-Text Editor === */}
          <div>
            <label htmlFor="post-content" className="cp-label">Content</label>
            <div className={`cp-editor-wrapper${errors.content ? ' editor-error' : ''}`}>

              {/* Toolbar */}
              <div className="cp-toolbar">
                <ToolbarButton title="Bold" onClick={() => insertFormat('**', '**')}>
                  <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => insertFormat('_', '_')}>
                  <em>I</em>
                </ToolbarButton>
                <div className="cp-toolbar-divider" />
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
                <div className="cp-toolbar-divider" />
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
                className="cp-textarea"
                aria-describedby={errors.content ? 'content-error' : undefined}
                aria-invalid={!!errors.content}
              />
            </div>
            {errors.content && (
              <p id="content-error" className="cp-error-text" role="alert">{errors.content}</p>
            )}
          </div>

          {/* === Submit Button === */}
          <div className="cp-submit-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cp-publish-btn"
            >
              {isSubmitting ? (
                <span className="cp-loading-row">
                  <span className="cp-spinner" /> Publishing...
                </span>
              ) : 'Publish Post'}
            </button>
          </div>

        </form>
      </div>
    </MainLayout>
  );
}

export default CreatePost;

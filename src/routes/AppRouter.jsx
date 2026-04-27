import { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CreatePost from '../pages/CreatePost';

// ============================================================
// AppRouter.jsx
// Chịu trách nhiệm duy nhất: quản lý điều hướng giữa các trang.
//
// Luồng điều hướng:
//  'home'        → Trang chủ (placeholder)
//  'login'       → Trang đăng nhập
//  'create-post' → Trang tạo bài viết
//
// Khi dự án mở rộng, thay thế bằng react-router-dom:
//   npm install react-router-dom
// ============================================================

export default function AppRouter() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => setCurrentPage(page);

  switch (currentPage) {
    case 'login':
      return <Login onNavigate={navigate} />;
    case 'register':
      return <Register onNavigate={navigate} />;
    case 'create-post':
      return <CreatePost onNavigate={navigate} />;
    default:
      return <HomePage onNavigate={navigate} />;
  }
}

// ============================================================
// HomePage — Placeholder, sẽ do thành viên khác phát triển
// ============================================================
function HomePage({ onNavigate }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      background: '#f6f7f9',
      gap: 24,
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111827' }}>🏠 ForumHub - Home</h1>
      <p style={{ color: '#6b7280', fontSize: 16 }}>
        Trang chủ sẽ hiển thị danh sách bài viết ở đây.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => onNavigate('login')}
          style={{
            padding: '10px 24px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Đến trang Login →
        </button>
        <button
          onClick={() => onNavigate('create-post')}
          style={{
            padding: '10px 24px',
            background: '#fff',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Đến trang Create Post →
        </button>
      </div>
    </div>
  );
}

import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import './App.css';

/**
 * App.jsx — Entry point của ứng dụng.
 * Chỉ có nhiệm vụ:
 *  1. Bọc toàn bộ app trong AuthProvider (cung cấp auth state toàn cục)
 *  2. Gọi AppRouter để xử lý điều hướng giữa các trang
 *
 * Mọi logic điều hướng nằm trong: src/routes/AppRouter.jsx
 */
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

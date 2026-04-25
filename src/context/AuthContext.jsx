import { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthLogin } from '../data/users';

// 1. Tạo Context object
const AuthContext = createContext(null);

// 2. Tạo Provider Component - bọc toàn bộ app để chia sẻ state
export function AuthProvider({ children }) {
  // State lưu thông tin user đang đăng nhập (null = chưa đăng nhập)
  const [user, setUser] = useState(null);
  // State loading để tránh flash UI khi khởi động
  const [loading, setLoading] = useState(true);

  // Khi app khởi động, kiểm tra xem đã có user lưu trong localStorage chưa
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('forumhub_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // Nếu dữ liệu bị corrupt, xóa đi
      localStorage.removeItem('forumhub_user');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Hàm login — xác thực dựa trên mock data (src/mock/users.js).
   * Khi tích hợp backend thật: thay mockAuthLogin bằng fetch/axios.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    // Giả lập độ trễ network 600ms
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Xác thực bằng mock data
    const result = mockAuthLogin(email, password);

    if (result.success) {
      setUser(result.user);
      localStorage.setItem('forumhub_user', JSON.stringify(result.user));
      return { success: true };
    }

    return { success: false, error: result.error };
  };


  /**
   * Hàm logout - xóa thông tin user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('forumhub_user');
  };

  // Giá trị được chia sẻ cho toàn bộ app
  const value = {
    user,       // object user hiện tại (null nếu chưa đăng nhập)
    loading,    // true khi đang kiểm tra localStorage lúc khởi động
    login,      // hàm đăng nhập
    logout,     // hàm đăng xuất
    isLoggedIn: !!user, // boolean tiện dụng
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Không render children cho đến khi kiểm tra auth xong */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook để dễ dàng sử dụng context trong các component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
}

export default AuthContext;

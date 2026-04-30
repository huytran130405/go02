export const users = [

  {
    userId: "08ebc86b-7bd3-496b-802b-3e5de093fcaf",
    userName: "Nghia",
    email: "nghia@gmail.com",
    password: "123456",
    avatar: "N",
    numberOfPost: 10
  },

  {
    userId: 2,
    userName: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    avatar: "A",
    numberOfPost: 5
  },

  {
    userId: 3,
    userName: "User1",
    email: "user1@gmail.com",
    password: "123456",
    avatar: "U",
    numberOfPost: 3
  }

];

// Alias dùng cho Register.jsx
export const MOCK_USERS = users;

/**
 * Xác thực email + password dựa trên mock data.
 * Khi tích hợp backend thật: thay hàm này bằng fetch/axios.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function mockAuthLogin(email, password) {
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (found) {
    // Không trả về password ra ngoài
    const { password: _, ...safeUser } = found;
    return { success: true, user: { ...safeUser, name: safeUser.userName } };
  }

  return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
}

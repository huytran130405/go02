/**
 * mock/users.js
 * Mock data cho UserService
 * Fields: userId, userName, email, password, avatar, numberOfPost
 *
 * Dùng trong Login.jsx để xác thực tài khoản giả lập (fake API).
 * Khi tích hợp backend thật, xóa file này và thay bằng API call.
 */

export const MOCK_USERS = [
  {
    userId: 'u001',
    userName: 'Nguyen Van A',
    email: 'admin@forumhub.com',
    password: '123456',          // plaintext chỉ cho mock, KHÔNG dùng ở production
    avatar: 'A',
    numberOfPost: 12,
  },
  {
    userId: 'u002',
    userName: 'Tran Thi B',
    email: 'user@forumhub.com',
    password: 'password123',
    avatar: 'T',
    numberOfPost: 5,
  },
  {
    userId: 'u003',
    userName: 'Le Van C',
    email: 'lec@example.com',
    password: 'levanc@2024',
    avatar: 'L',
    numberOfPost: 27,
  },
  {
    userId: 'u004',
    userName: 'Google User',
    email: 'user.google@gmail.com',
    password: 'google-auth-pass', // Dùng cho nút Login with Google (giả lập)
    avatar: 'G',
    numberOfPost: 0,
  },
];

/**
 * mock/posts.js
 * Mock data cho PostService
 * Fields: postId, userId, title, content, stats, timeStamps
 */

export const MOCK_POSTS = [
  {
    postId: 'p001',
    userId: 'u001',
    title: 'Giới thiệu về React 19 và những tính năng mới',
    content: 'React 19 mang đến nhiều cải tiến đáng kể như Server Components, Actions và các hook mới...',
    stats: {
      views: 1240,
      likes: 87,
      comments: 14,
    },
    timeStamps: {
      createdAt: '2024-03-15T08:30:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
    },
  },
  {
    postId: 'p002',
    userId: 'u002',
    title: 'Hướng dẫn xây dựng REST API với Node.js và Express',
    content: 'Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng một REST API hoàn chỉnh...',
    stats: {
      views: 892,
      likes: 56,
      comments: 9,
    },
    timeStamps: {
      createdAt: '2024-03-14T14:00:00Z',
      updatedAt: '2024-03-14T14:00:00Z',
    },
  },
  {
    postId: 'p003',
    userId: 'u003',
    title: 'Tại sao TypeScript lại quan trọng với dự án lớn?',
    content: 'TypeScript giúp phát hiện lỗi sớm, cải thiện trải nghiệm phát triển và tăng khả năng bảo trì...',
    stats: {
      views: 2103,
      likes: 145,
      comments: 31,
    },
    timeStamps: {
      createdAt: '2024-03-10T09:00:00Z',
      updatedAt: '2024-03-12T16:45:00Z',
    },
  },
];

/**
 * mock/comments.js
 * Mock data cho CommentService
 * Fields: commentId, postId, userId, content, createdAt
 */

export const MOCK_COMMENTS = [
  {
    commentId: 'c001',
    postId: 'p001',
    userId: 'u002',
    content: 'Bài viết rất hữu ích! Mình đã áp dụng thành công vào dự án.',
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    commentId: 'c002',
    postId: 'p001',
    userId: 'u003',
    content: 'React 19 thực sự là một bước tiến lớn. Cảm ơn tác giả!',
    createdAt: '2024-03-15T11:30:00Z',
  },
  {
    commentId: 'c003',
    postId: 'p002',
    userId: 'u001',
    content: 'Mình đang tìm kiếm bài như thế này. Rất chi tiết và dễ hiểu.',
    createdAt: '2024-03-14T15:20:00Z',
  },
  {
    commentId: 'c004',
    postId: 'p003',
    userId: 'u002',
    content: 'TypeScript giúp team mình giảm bug rất nhiều.',
    createdAt: '2024-03-11T08:45:00Z',
  },
];

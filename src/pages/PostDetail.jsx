import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import CommentForm from "../components/forms/CommentForm";
import postService from "../services/postService";

import { users } from "../data/users";
import { comments as mockComments } from "../data/comments";
import { posts as mockRecentPosts } from "../data/posts";

import "../styles/postDetail.css";

const AVATAR_COLORS = ["#61A87D", "#8C72CB", "#E69B4B", "#E86C97", "#3b82f6", "#14b8a6"];

const getAvatarColor = (userId) => {
  if (!userId) return AVATAR_COLORS[0];
  let hash = 0;
  const str = String(userId);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const CommentThread = ({ comment, allComments, replyingTo, setReplyingTo, onAddComment }) => {
  const user = users.find((u) => u.userId === comment.userId);
  const displayName = user ? user.userName : `User ${String(comment.userId).slice(0, 4)}`;
  const avatarLetter = user ? user.avatar : displayName.charAt(0).toUpperCase();
  const replies = allComments.filter((c) => c.parentId === comment.commentId);

  return (
    <div className="pd-comment-thread">
      <div className="pd-comment">
        <div className="pd-comment-line" />
        <div className="pd-comment-avatar-wrap">
          <div className="pd-comment-avatar" style={{ backgroundColor: getAvatarColor(comment.userId) }}>
            {avatarLetter}
          </div>
        </div>
        <div className="pd-comment-body">
          <div className="pd-comment-header">
            <span className="pd-comment-author">{displayName}</span>
            <span className="pd-comment-time">· {comment.createdAt}</span>
          </div>
          <p className="pd-comment-text">{comment.content}</p>
          <button 
            className="pd-reply-btn"
            onClick={() => setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)}
          >
            {replyingTo === comment.commentId ? "Cancel" : "Reply"}
          </button>
          {replyingTo === comment.commentId && (
            <div className="pd-nested-reply-form">
              <CommentForm onAddComment={(text) => onAddComment(text, comment.commentId)} />
            </div>
          )}
        </div>
      </div>
      {replies.length > 0 && (
        <div className="pd-comment-replies">
          {replies.map((reply) => (
            <CommentThread
              key={reply.commentId}
              comment={reply}
              allComments={allComments}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const postData = await postService.findPostById(id);
        const actualPost = postData.post || postData;
        
        setPost(actualPost);
        setLikes(actualPost.likes || 0); 
        
        const postComments = mockComments.filter((c) => String(c.postId) === String(actualPost.postId || actualPost.id));
        setComments(postComments);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  if (loading) return <MainLayout><div className="pd-loading">Đang tải bài viết...</div></MainLayout>;
  if (!post) return <MainLayout><div className="pd-not-found">Không tìm thấy bài viết.</div></MainLayout>;

  const author = users.find((u) => u.userId === post.userId);
  const rootComments = comments.filter((c) => !c.parentId);

  const formatgRPCDate = (dateField) => {
    if (!dateField) return "Vừa xong";
    if (typeof dateField === 'string') return new Date(dateField).toLocaleDateString();
    if (dateField.seconds) return new Date(dateField.seconds * 1000).toLocaleDateString();
    return "Vừa xong";
  };

  const handleAddComment = (text, parentId = null) => {
    setComments([
      ...comments,
      {
        commentId: Date.now(),
        postId: post.postId || post.id,
        userId: "current-user-id", 
        parentId: parentId,
        content: text,
        createdAt: "Vừa xong",
      },
    ]);
    setReplyingTo(null);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <MainLayout>
      <div className="pd-layout">
        <div className="pd-left">
          <Link to="/" className="pd-back">
            <svg className="pd-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Back to Home
          </Link>

          <article className="pd-post-card">
            <div className="pd-post-body">
              <h1 className="pd-post-title">{post.title}</h1>

              <div className="pd-author-row">
                <div className="pd-avatar" style={{ backgroundColor: getAvatarColor(post.userId) }}>
                  {author?.avatar || post.userId?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="pd-author-name">{author?.userName || "Thành viên Forum"}</div>
                  <div className="pd-author-meta">
                    {formatgRPCDate(post.createdAt || post.created_at)} · {post.views || 0} views
                  </div>
                </div>
              </div>

              <p className="pd-post-content">{post.content}</p>
            </div>

            <div className="pd-interaction-bar">
              <button className={`pd-action-btn${liked ? " pd-action-btn--active" : ""}`} onClick={handleLike}>
                <svg className="pd-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>{likes} Likes</span>
              </button>

              <button className="pd-action-btn">
                <svg className="pd-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>{comments.length} Comments</span>
              </button>
            </div>
          </article>

          <section className="pd-comments-card">
            <h2 className="pd-comments-title">Comments ({comments.length})</h2>
            <div className="pd-comments-list">
              {rootComments.map((c) => (
                <CommentThread
                  key={c.commentId}
                  comment={c}
                  allComments={comments}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
            <div className="pd-comment-form-wrap" style={{ marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 24 }}>
              <h3>Write a comment</h3>
              <CommentForm onAddComment={(text) => handleAddComment(text, null)} />
            </div>
          </section>
        </div>

        <aside className="pd-sidebar">
          <div className="pd-sidebar-card">
            <h3 className="pd-sidebar-title">About Author</h3>
            <div className="pd-sidebar-author">
              <div className="pd-avatar pd-avatar--lg" style={{ backgroundColor: getAvatarColor(post.userId) }}>
                {author?.avatar || "U"}
              </div>
              <div>
                <div className="pd-sidebar-author-name">{author?.userName || "Thành viên"}</div>
                <div className="pd-sidebar-author-meta">Dữ liệu từ Cloud</div>
              </div>
            </div>
          </div>

          <div className="pd-sidebar-card">
            <h3 className="pd-sidebar-title">Recent Posts</h3>
            <ul className="pd-recent-list">
              {mockRecentPosts.slice(0, 5).map((p) => (
                <li key={p.postId}>
                  <Link to={`/post/${p.postId}`} className="pd-recent-link">{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default PostDetail;
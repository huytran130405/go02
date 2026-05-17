import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import postService from "../services/postService";
import { users } from "../data/users";

import "../styles/home.css";

const AVATAR_COLORS = ["#61A87D", "#8C72CB", "#E69B4B", "#E86C97", "#3b82f6"];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const formatgRPCDate = (dateField) => {
    if (!dateField) return "Vừa xong";
    if (typeof dateField === 'string') return new Date(dateField).toLocaleDateString();
    if (dateField.seconds) return new Date(dateField.seconds * 1000).toLocaleDateString();
    return "Vừa xong";
  };

  if (isLoading) return <MainLayout><div className="loading">Đang tải bài viết từ hệ thống...</div></MainLayout>;
  if (error) return <MainLayout><div className="error-box">Lỗi: {error}</div></MainLayout>;

  return (
    <MainLayout>
      {/* Page Header Row */}
      <div className="home-header">
        <h1 className="home-title">All Posts</h1>
        <Link to="/create-post" className="create-btn">
          <span className="create-btn-icon">+</span>
          Create Post
        </Link>
      </div>

      {/* Posts List Card */}
      <div className="posts-card">
        {posts.map((post, index) => {
          const user = users.find((u) => u.userId === post.userId);
          const userName = post.authorName || `User ${String(post.userId || 'Guest').slice(0, 4)}`;
          const avatarLetter = userName.charAt(0).toUpperCase();
          const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
          const currentId = post.id || post.postId || post.post_id;

          return (
            <article className="post-item" key={currentId}>
              {/* Avatar */}
              <div className="post-avatar" style={{ backgroundColor: avatarColor }}>
                {avatarLetter}
              </div>

              {/* Content */}
              <div className="post-content">
                <Link to={`/posts/${currentId}`} className="post-link">
                  <h2 className="post-title">{post.title}</h2>
                </Link>

                <p className="post-desc">{post.content}</p>

                <div className="post-meta">
                  <span className="meta-author">{userName}</span>
                  <span className="meta-dot">•</span>
                  <span>{formatgRPCDate(post.createdAt || post.created_at)}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-comments">
                    <i className="fa-regular fa-comment"></i>
                    {post.likes || 0} likes 
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Home;
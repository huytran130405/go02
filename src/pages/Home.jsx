import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import { posts } from "../data/posts";
import { users } from "../data/users";



import "../styles/home.css";
import postService from "../services/postService";

/* Avatar background colors cycling through the palette */
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
          const userName = post.authorName || `User ${post.userId || 'Guest'}`;
          const avatarLetter = userName.charAt(0).toUpperCase();
          const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

          const currentId = post.id || post.postId;

          return (
            <article className="post-item" key={currentId}>

              {/* Avatar */}
              <div
                className="post-avatar"
                style={{ backgroundColor: avatarColor }}
              >
                {avatarLetter}
              </div>

              {/* Content */}
              <div className="post-content">

                <Link to={`/post/${post.postId}`} className="post-link">
                  <h2 className="post-title">{post.title}</h2>
                </Link>

                <p className="post-desc">{post.content}</p>

                <div className="post-meta">
                  <span className="meta-author">{userName}</span>
                  <span className="meta-dot">•</span>
                  <span>{post.timeStamps}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-comments">
                    <i className="fa-regular fa-comment"></i>
                    {post.stats?.comments || 0} comments
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
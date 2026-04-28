import React from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import { posts } from "../data/posts";
import { users } from "../data/users";

import "../styles/home.css";

/* Avatar background colors cycling through the palette */
const AVATAR_COLORS = ["#61A87D", "#8C72CB", "#E69B4B", "#E86C97", "#3b82f6"];

const Home = () => {
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
          const userName = user ? user.userName : `User ${post.userId}`;
          const avatarLetter = user ? user.avatar : userName.charAt(0).toUpperCase();
          const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

          return (
            <article className="post-item" key={post.postId}>

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
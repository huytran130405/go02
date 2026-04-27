import React, { useState } from "react";
import "../../styles/commentForm.css";

const CommentForm = ({ onAddComment }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddComment(comment);
    setComment("");
  };

  return (
    <form className="cf-form" onSubmit={handleSubmit}>
      <textarea
        className="cf-textarea"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="3"
      />
      <div className="cf-footer">
        <button type="submit" className="cf-submit-btn">
          Post Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
import React from "react";
import PropTypes from "prop-types";

export const CommentList = ({
  comments,
  loading,
  error,
  onLoadMore,
  hasMore,
}) => {
  return (
    <div className="comments-list">
      {error && <div className="error-state">{error}</div>}
      {comments.length === 0 && !loading && (
        <div className="empty-state">No comments yet.</div>
      )}
      {comments.map((c) => (
        <div key={c.id} className="comment-card">
          <div>
            <strong>{c.authorName}</strong>{" "}
            <span>{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <div>{c.text}</div>
        </div>
      ))}
      {loading && <div className="loading-indicator">Loading comments...</div>}
      {hasMore && !loading && (
        <button className="load-more-btn" onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
};
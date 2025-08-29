import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export const AnnouncementDetail = ({ announcementId, userId }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsCursor, setCommentsCursor] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [reactionsPending, setReactionsPending] = useState(false);
  const [reactionError, setReactionError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Poll for real-time updates
  useEffect(() => {
    let interval;
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const data = await api.getAnnouncement(announcementId);
        setAnnouncement(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load announcement");
        setLoading(false);
      }
    };
    fetchAnnouncement();
    interval = setInterval(fetchAnnouncement, 5000);
    return () => clearInterval(interval);
  }, [announcementId]);

  // Initial comments load
  useEffect(() => {
    loadComments();
    // eslint-disable-next-line
  }, [announcementId]);

  const loadComments = async (cursor = null) => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const res = await api.getComments(announcementId, cursor, 10);
      if (cursor) {
        setComments((prev) => [...prev, ...res.comments]);
      } else {
        setComments(res.comments);
      }
      if (res.comments.length > 0) {
        setCommentsCursor(res.comments[res.comments.length - 1].id);
      }
      setCommentsLoading(false);
    } catch (err) {
      setCommentsError("Failed to load comments");
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentSubmitting(true);
    setCommentsError(null);
    const optimisticComment = {
      id: "optimistic-" + Date.now(),
      authorName: userId || "You",
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimisticComment, ...prev]);
    setCommentText("");
    try {
      const res = await api.addComment(announcementId, {
        authorName: userId || "You",
        text: optimisticComment.text,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimisticComment.id ? res.comment : c
        )
      );
    } catch (err) {
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
      setCommentsError("Failed to add comment");
    }
    setCommentSubmitting(false);
  };

  const handleReaction = async (type) => {
    setReactionsPending(true);
    setReactionError(null);
    try {
      await api.addReaction(announcementId, type, userId);
      // Optimistically update announcement reactions
      const updated = await api.getAnnouncement(announcementId);
      setAnnouncement(updated);
    } catch (err) {
      setReactionError("Failed to react");
    }
    setReactionsPending(false);
  };

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!announcement) return <div className="empty-state">Announcement not found.</div>;

  return (
    <div className="announcement-detail card">
      <h2>{announcement.title}</h2>
      <p>{announcement.description}</p>
      <div className="meta">
        <span>Status: {announcement.status}</span>
        <span>
          Last activity: {new Date(announcement.lastActivityAt).toLocaleString()}
        </span>
        <span>Comments: {announcement.comments.length}</span>
        <span>
          Reactions: 👍 {announcement.reactions.filter(r => r.type === "up").length}{" "}
          👎 {announcement.reactions.filter(r => r.type === "down").length}{" "}
          ❤️ {announcement.reactions.filter(r => r.type === "heart").length}
        </span>
      </div>
      <div className="reaction-bar">
        <button
          disabled={reactionsPending}
          onClick={() => handleReaction("up")}
        >
          👍
        </button>
        <button
          disabled={reactionsPending}
          onClick={() => handleReaction("down")}
        >
          👎
        </button>
        <button
          disabled={reactionsPending}
          onClick={() => handleReaction("heart")}
        >
          ❤️
        </button>
        {reactionError && <span className="error-state">{reactionError}</span>}
      </div>
      <hr />
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          disabled={commentSubmitting}
          maxLength={500}
        />
        <button type="submit" disabled={commentSubmitting || !commentText.trim()}>
          Add Comment
        </button>
      </form>
      {commentsError && <div className="error-state">{commentsError}</div>}
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <div>
              <strong>{c.authorName}</strong> <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <div>{c.text}</div>
          </div>
        ))}
        {commentsLoading && <div className="loading-indicator">Loading comments...</div>}
        {!commentsLoading && comments.length >= 10 && (
          <button onClick={() => loadComments(commentsCursor)}>
            Load more
          </button>
        )}
        {!commentsLoading && comments.length === 0 && (
          <div className="empty-state">No comments yet.</div>
        )}
      </div>
    </div>
  );
};
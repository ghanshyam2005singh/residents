import React, { useState } from "react";
import { api } from "../lib/api";
import PropTypes from "prop-types";

export const AnnouncementForm = ({ onAnnouncementCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newAnnouncement = await api.createAnnouncement({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      onAnnouncementCreated(newAnnouncement);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create announcement",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="announcement-form">
      <h2>Create New Announcement</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter announcement description (optional)"
            disabled={isLoading}
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="submit-button"
        >
          {isLoading ? "Creating..." : "Create Announcement"}
        </button>
      </form>
    </div>
  );
};

AnnouncementForm.propTypes = {
  onAnnouncementCreated: PropTypes.func.isRequired,
};

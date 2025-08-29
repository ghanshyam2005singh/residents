import React, { useState } from "react";
import { api } from "../lib/api";
import PropTypes from "prop-types";

export const AnnouncementFeed = ({ announcements, onAnnouncementsChange }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [reactionPending, setReactionPending] = useState({});
  const [filter, setFilter] = useState("all");

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (filter === "all") return true;
    return announcement.status === filter;
  });

  const activeCount = announcements.filter((a) => a.status === "active").length;
  const closedCount = announcements.filter((a) => a.status === "closed").length;

  const handleStatusChange = async (id, newStatus) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const updatedAnnouncement = await api.updateAnnouncementStatus(id, {
        status: newStatus,
      });
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement.id === id ? updatedAnnouncement : announcement,
      );
      onAnnouncementsChange(updatedAnnouncements);
    } catch (error) {
      alert("Failed to update announcement status. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReaction = async (id, type) => {
    setReactionPending((prev) => ({ ...prev, [id]: true }));
    try {
      await api.addReaction(id, type, "demo-user");
      // Optionally refetch or update announcement locally
      // For demo, just reload announcements
      const updatedAnnouncements = await api.getAnnouncements();
      onAnnouncementsChange(updatedAnnouncements);
    } catch (error) {
      alert("Failed to react. Please try again.");
    } finally {
      setReactionPending((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="announcement-feed">
      <div className="feed-header">
        <h2>Community Announcements</h2>
        <div className="stats">
          <span className="stat active">Active: {activeCount}</span>
          <span className="stat closed">Closed: {closedCount}</span>
        </div>
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="empty-state">
          {filter === "all"
            ? "No announcements yet. Create the first one!"
            : `No ${filter} announcements.`}
        </div>
      ) : (
        <div className="announcements-list">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <h3 className="announcement-title">{announcement.title}</h3>
                <div className="status-control">
                  <select
                    value={announcement.status}
                    onChange={(e) =>
                      handleStatusChange(announcement.id, e.target.value)
                    }
                    disabled={loadingStates[announcement.id]}
                    className={`status-select ${announcement.status}`}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                  {loadingStates[announcement.id] && (
                    <span className="loading-indicator">Updating...</span>
                  )}
                </div>
              </div>

              {announcement.description && (
                <p className="announcement-description">
                  {announcement.description}
                </p>
              )}

              <div className="announcement-meta">
                <span className={`status-badge ${announcement.status}`}>
                  {announcement.status.toUpperCase()}
                </span>
                <span className="timestamp">
                  Created: {formatDate(announcement.createdAt)}
                </span>
                <span>
                  Last activity: {formatDate(announcement.lastActivityAt)}
                </span>
                <span>
                  Comments: {announcement.comments ? announcement.comments.length : 0}
                </span>
                <span>
                  👍 {announcement.reactions ? announcement.reactions.filter(r => r.type === "up").length : 0}{" "}
                  👎 {announcement.reactions ? announcement.reactions.filter(r => r.type === "down").length : 0}{" "}
                  ❤️ {announcement.reactions ? announcement.reactions.filter(r => r.type === "heart").length : 0}
                </span>
              </div>

              <div className="reaction-bar">
                <button
                  disabled={reactionPending[announcement.id]}
                  onClick={() => handleReaction(announcement.id, "up")}
                >
                  👍
                </button>
                <button
                  disabled={reactionPending[announcement.id]}
                  onClick={() => handleReaction(announcement.id, "down")}
                >
                  👎
                </button>
                <button
                  disabled={reactionPending[announcement.id]}
                  onClick={() => handleReaction(announcement.id, "heart")}
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AnnouncementFeed.propTypes = {
  announcements: PropTypes.array.isRequired,
  onAnnouncementsChange: PropTypes.func.isRequired,
};
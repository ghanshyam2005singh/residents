const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchWithErrorHandling(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 304) {
    return null; // Not modified
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || "An error occurred");
  }

  return response.json();
}

export const api = {
  async getAnnouncements(etag) {
    return fetchWithErrorHandling(`${BASE_URL}/announcements`, {
      headers: etag ? { "If-None-Match": etag } : {},
    });
  },

  async getAnnouncement(id) {
    return fetchWithErrorHandling(`${BASE_URL}/announcements/${id}`);
  },

  async createAnnouncement(data) {
    return fetchWithErrorHandling(`${BASE_URL}/announcements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async updateAnnouncementStatus(id, data) {
    return fetchWithErrorHandling(`${BASE_URL}/announcements/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async getComments(announcementId, cursor, limit = 10) {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit);
    return fetchWithErrorHandling(
      `${BASE_URL}/announcements/${announcementId}/comments?${params.toString()}`
    );
  },

  async addComment(announcementId, data) {
    return fetchWithErrorHandling(
      `${BASE_URL}/announcements/${announcementId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  },

  async addReaction(announcementId, type, userId) {
    return fetchWithErrorHandling(
      `${BASE_URL}/announcements/${announcementId}/reactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
          "idempotency-key": Date.now().toString(),
        },
        body: JSON.stringify({ type }),
      }
    );
  },
};
import {
  Announcement,
  CreateAnnouncementDto,
  UpdateAnnouncementStatusDto,
} from "../types/announcement";

const BASE_URL = "http://localhost:4000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || "An error occurred");
  }

  return response.json();
}

export const api = {
  async getAnnouncements(): Promise<Announcement[]> {
    return fetchWithErrorHandling<Announcement[]>(`${BASE_URL}/announcements`);
  },

  async createAnnouncement(data: CreateAnnouncementDto): Promise<Announcement> {
    return fetchWithErrorHandling<Announcement>(`${BASE_URL}/announcements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async updateAnnouncementStatus(
    id: string,
    data: UpdateAnnouncementStatusDto,
  ): Promise<Announcement> {
    return fetchWithErrorHandling<Announcement>(
      `${BASE_URL}/announcements/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
  },
};

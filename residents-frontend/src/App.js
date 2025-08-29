import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnnouncementForm } from "./components/AnnouncementForm";
import { AnnouncementFeed } from "./components/AnnouncementFeed";
import { AnnouncementDetail } from "./components/AnnouncementDetail";
import { api } from "./lib/api";
import "./App.css";
import "./index.css";

function App() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setError(null);
      const data = await api.getAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load announcements"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementCreated = (newAnnouncement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const handleAnnouncementsChange = (updatedAnnouncements) => {
    setAnnouncements(updatedAnnouncements);
  };

  // Filter logic
  const filteredAnnouncements =
    filter === "all"
      ? announcements
      : announcements.filter((a) => a.status === filter);

  // Counters
  const activeCount = announcements.filter((a) => a.status === "active").length;
  const closedCount = announcements.filter((a) => a.status === "closed").length;

  return (
    <Router>
      <div className="app-bg">
        <div className="app-container">
          <header className="app-header card">
            <h1>🏠 Residents Noticeboard</h1>
            <p>Community announcements and notices</p>
          </header>
          <main className="app-main">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="card form-card">
                      <AnnouncementForm onAnnouncementCreated={handleAnnouncementCreated} />
                    </div>
                    <div className="card feed-card">
                      <div className="filter-bar">
                        <button
                          className={filter === "all" ? "active" : ""}
                          onClick={() => setFilter("all")}
                        >
                          All
                        </button>
                        <button
                          className={filter === "active" ? "active" : ""}
                          onClick={() => setFilter("active")}
                        >
                          Active ({activeCount})
                        </button>
                        <button
                          className={filter === "closed" ? "active" : ""}
                          onClick={() => setFilter("closed")}
                        >
                          Closed ({closedCount})
                        </button>
                      </div>
                      {isLoading ? (
                        <div className="loading-state">Loading announcements...</div>
                      ) : error ? (
                        <div className="error-state">
                          <p>Error: {error}</p>
                          <button onClick={loadAnnouncements} className="retry-button">
                            Retry
                          </button>
                        </div>
                      ) : (
                        <AnnouncementFeed
                          announcements={filteredAnnouncements}
                          onAnnouncementsChange={handleAnnouncementsChange}
                        />
                      )}
                    </div>
                  </>
                }
              />
              <Route
                path="/announcement/:id"
                element={<AnnouncementDetail userId="demo-user" />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
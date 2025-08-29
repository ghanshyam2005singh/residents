# Residents Noticeboard

A simple announcement system for residents to create, view, and manage community notices. Built with React frontend and NestJS backend.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: NestJS + TypeScript (Port 4000)
- **Storage**: In-memory array (no database)
- **Communication**: REST API with CORS enabled

## 📋 Features

### Core Features

- ✅ Create announcements with title (required) and description (optional)
- ✅ View all announcements in a feed (newest first)
- ✅ Change announcement status between 'active' and 'closed'
- ✅ Real-time UI updates after actions
- ✅ Form validation and error handling
- ✅ Loading states and disabled controls

### Nice-to-Have Features

- 🔄 Filter announcements by status (Active/Closed)
- 📊 Display counters for active/closed announcements
- 📅 Automatic timestamps and sorting

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/basera-tushar-langer/interview
   cd interview
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend (Terminal 1)**

   ```bash
   cd backend
   npm run start:dev
   ```

   Backend runs on: http://localhost:4000

2. **Start Frontend (Terminal 2)**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend runs on: http://localhost:5173

3. **Open your browser** and navigate to http://localhost:5173

## 🛠️ API Reference

### Base URL

```
http://localhost:4000
```

### Data Types

```typescript
type Status = "active" | "closed";

interface Announcement {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
}
```

### Endpoints

#### Create Announcement

```http
POST /announcements
Content-Type: application/json

{
  "title": "Water tank cleaning",
  "description": "Sunday 8–11 AM"
}
```

**Response:**

```json
{
  "id": "1693123456789",
  "title": "Water tank cleaning",
  "description": "Sunday 8–11 AM",
  "status": "active",
  "createdAt": "2023-08-27T10:30:56.789Z"
}
```

#### List Announcements

```http
GET /announcements
```

**Response:**

```json
[
  {
    "id": "1693123456789",
    "title": "Water tank cleaning",
    "description": "Sunday 8–11 AM",
    "status": "active",
    "createdAt": "2023-08-27T10:30:56.789Z"
  }
]
```

#### Update Announcement Status

```http
PATCH /announcements/:id
Content-Type: application/json

{
  "status": "closed"
}
```

**Response:**

```json
{
  "id": "1693123456789",
  "title": "Water tank cleaning",
  "description": "Sunday 8–11 AM",
  "status": "closed",
  "createdAt": "2023-08-27T10:30:56.789Z"
}
```

## 📁 Project Structure

```
interview/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── announcements/   # Announcements module
│   │   │   ├── announcements.controller.ts
│   │   │   ├── announcements.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-announcement.dto.ts
│   │   │   │   └── update-announcement-status.dto.ts
│   │   │   └── interfaces/
│   │   │       └── announcement.interface.ts
│   │   ├── app.module.ts
│   │   └── main.ts          # CORS configuration
│   ├── package.json
│   └── ...
├── frontend/                # React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnouncementForm.tsx
│   │   │   └── AnnouncementFeed.tsx
│   │   ├── lib/
│   │   │   └── api.ts       # API utilities
│   │   ├── types/
│   │   │   └── announcement.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── ...
└── README.md
```

## 🔧 Development Workflow

### Backend Development (NestJS)

1. **Create Controller & Service**
   - AnnouncementsController handles HTTP requests
   - AnnouncementsService manages in-memory data store

2. **Define DTOs**

   ```typescript
   // CreateAnnouncementDto
   { title: string; description?: string }

   // UpdateAnnouncementStatusDto
   { status: 'active' | 'closed' }
   ```

3. **Implement Routes**
   - POST: Generate ID, set defaults, store announcement
   - GET: Return sorted array (newest first)
   - PATCH: Update status if valid

4. **Enable CORS**
   ```typescript
   // main.ts
   app.enableCors({
     origin: "http://localhost:5173",
   });
   ```

### Frontend Development (React)

1. **Create Components**
   - `AnnouncementForm`: Title/description form with validation
   - `AnnouncementFeed`: List with status controls

2. **API Integration**
   - GET on component mount
   - POST on form submit
   - PATCH on status change

3. **State Management**
   - Form state (title, description, loading, errors)
   - Feed state (announcements, loading, errors)

4. **UX Features**
   - Disable submit when title empty
   - Show loading states
   - Display error messages
   - Real-time updates

## ✅ Definition of Done Checklist

- [x] Can create an announcement from UI; it appears in the feed
- [x] Page loads list from API and shows title/status/description
- [x] Can close an announcement; UI updates
- [x] CORS works between ports 4000 and 5173
- [x] Title required, simple error/loading behavior

## 🎯 User Journey

1. **Create Announcement**
   - User fills form with title (required) and description (optional)
   - Clicks submit → POST request → Success feedback
   - New announcement appears at top of feed

2. **View Announcements**
   - Page loads → GET request → Display all announcements
   - Shows title, status badge, description, timestamps
   - Sorted by newest first

3. **Manage Status**
   - User clicks status dropdown → Select new status
   - PATCH request → Success → UI updates immediately
   - Visual feedback during operation

## 🚀 Available Scripts

### Backend

```bash
npm run start         # Production
npm run start:dev     # Development with hot reload
npm run build         # Build for production
npm run test          # Run tests
```

### Frontend

```bash
npm run dev           # Development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

## 🔍 Testing the Application

1. **Start both servers** (backend on :4000, frontend on :5173)

2. **Test Create Flow**
   - Fill form with title "Test Announcement"
   - Add description "This is a test"
   - Submit → Should appear in feed

3. **Test Status Change**
   - Click status dropdown
   - Change from "Active" to "Closed"
   - Verify badge color changes

4. **Test Validation**
   - Try submitting empty title → Button should be disabled
   - Network errors → Should show error message

## 🛡️ Error Handling

- **Frontend**: User-friendly error messages for API failures
- **Backend**: Proper HTTP status codes and error responses
- **Validation**: Required fields enforced on both ends
- **Loading States**: Prevent multiple submissions and show progress

## 📝 Notes

- **No Database**: Data stored in memory array (resets on server restart)
- **Simple Auth**: No authentication/authorization implemented
- **Basic Styling**: Minimal CSS for functionality focus
- **TypeScript**: Full type safety across frontend and backend

## 🔮 Future Enhancements

- Add persistent storage (database)
- Implement user authentication
- Add announcement categories
- Email notifications for new announcements
- Rich text editor for descriptions
- File attachments support
- Advanced filtering and search

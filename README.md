# B2B Management System

A full-stack B2B organization management web application built with React, Tailwind CSS, Node.js, Express, and SQLite.

## Features

### Core Functionality
- View and manage B2B organizations
- Organization details with profile editing
- User management (Admin and Co-ordinator roles)
- Status tracking (Active, Blocked, Inactive)
- Logo upload and management (supports images and emojis)
- Search functionality for organizations
- Dashboard with organization statistics

### User Experience
- **Loading States**: Spinner indicators during data fetching and async operations
- **Error Handling**: Comprehensive error messages with dismissible alerts
- **Success Feedback**: Toast notifications for all CRUD operations
- **Form Validation**: Disabled buttons during submissions to prevent double-clicks
- **Responsive Design**: Grid-based layout with Tailwind CSS
- Clean, modern UI matching professional B2B management systems

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- React Router
- Vite

**Backend:**
- Node.js
- Express
- SQLite (better-sqlite3)

**Database Choice:**
SQLite was chosen for this project for its simplicity and ease of setup. It provides:
- Zero configuration - no separate database server required
- File-based storage - entire database in a single file
- Perfect for development and small to medium applications
- Easy to backup and migrate
- No installation dependencies

For production deployments requiring high concurrency or distributed systems,  we can consider migrating to PostgreSQL or MySQL.

## Installation

1. Install all dependencies (root, frontend, and backend):
```bash
npm run install-all
```

2. Start both frontend and backend servers with a single command:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Alternative: Run servers separately
If you prefer to run them in separate terminals:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```



Note: Sample data is only inserted once when the database is first created.

## Loading States & Error Handling

### Loading States
The application implements comprehensive loading states across all pages:

**Dashboard**
- Loading spinner while fetching organization statistics
- Skeleton states for stat cards

**Organizations List**
- Full-page loading spinner during initial data fetch
- Prevents interaction until data is loaded

**Organization Details**
- Loading spinner on page load
- Button loading states with spinner during save operations
- Disabled form inputs during async operations

**Implementation**
```javascript
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)

// Loading spinner component with 3 sizes: sm, md, lg
<LoadingSpinner size="lg" />
```

### Error Handling
All API calls are wrapped in try-catch blocks with user-friendly error messages:

**Error Alert Component**
- Dismissible error messages
- Displayed at the top of pages
- Red color scheme for visibility
- Shows specific error messages from API failures

**Toast Notifications**
- Success/error feedback for all CRUD operations
- Auto-dismiss after 3 seconds
- Slide-in animation from top-right
- Color-coded: Green (success), Red (error)

**Error States Covered**
- Network failures
- API endpoint errors
- Failed CRUD operations (Create, Read, Update, Delete)
- Image upload failures (payload too large)
- Organization/user not found

**Implementation**
```javascript
const [error, setError] = useState(null)
const [toast, setToast] = useState(null)

try {
  const res = await fetch('...')
  if (!res.ok) throw new Error('Failed to fetch')
  // Success handling
  setToast({ message: 'Success!', type: 'success' })
} catch (err) {
  setError(err.message)
  setToast({ message: err.message, type: 'error' })
}
```


## Project Structure

```
b2b-management/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── AddOrganizationModal.jsx
│   │   │   └── AddUserModal.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Organizations.jsx
│   │   │   └── OrganizationDetails.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── backend/
│   ├── server.js
│   ├── database.js
│   └── package.json
└── README.md
```

## API Endpoints

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization (includes logo as base64)
- `DELETE /api/organizations/:id` - Delete organization

### Users
- `GET /api/organizations/:id/users` - Get users for organization
- `POST /api/organizations/:id/users` - Add user to organization
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Configuration
- Payload limit: 50MB (supports large image uploads)
- CORS enabled for frontend communication
- JSON body parser with extended URL encoding

## Components

### Reusable UI Components
- **LoadingSpinner** - Animated spinner with 3 sizes (sm, md, lg)
- **ErrorAlert** - Dismissible error message component
- **Toast** - Auto-dismissing notification with success/error variants
- **Layout** - Main layout with header, navigation, and search
- **Modals** - AddOrganizationModal, AddUserModal, EditUserModal

### Pages
- **Dashboard** - Organization statistics overview
- **Organizations** - List view with search and CRUD operations
- **OrganizationDetails** - Detailed view with tabs (Basic details, Users)

## Database Schema

**organizations table:**
- id, name, slug, email, contact, phone, alt_phone, max_coordinators, timezone, region, language, website, logo, status, pending_requests, created_at

**users table:**
- id, organization_id, name, role, created_at

**Relationship:** One-to-Many (Organizations → Users) with CASCADE delete

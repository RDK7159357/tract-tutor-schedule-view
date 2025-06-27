# Track Tutor - Faculty Schedule Management System Documentation

## Project Overview

Track Tutor is a comprehensive faculty schedule management system designed for universities. It provides an intuitive interface for managing faculty schedules, courses, rooms, and time slots. The application supports both user and administrator roles with different permissions and capabilities.

## Architecture

The project follows a modern client-server architecture:

### Frontend
- Built with React, TypeScript, and Vite
- Uses Tailwind CSS and shadcn-ui for styling
- Implements responsive design for various device sizes
- Includes dark/light theme support

### Backend
- Node.js with Express.js REST API
- PostgreSQL database for data persistence
- Implements CRUD operations for all entities

### Deployment
- Docker containerization for both frontend and backend
- AWS deployment with:
  - S3 for frontend hosting
  - ECR for Docker image registry
  - EC2 for backend hosting
- CI/CD pipeline using Jenkins

## Technologies Used

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn-ui**: UI component library
- **Lucide React**: Icon library
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Supabase**: Authentication with email verification and OAuth

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **pg**: PostgreSQL client for Node.js
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing

### DevOps
- **Docker**: Containerization
- **Jenkins**: CI/CD pipeline
- **AWS**: Cloud infrastructure (S3, ECR, EC2)

## Database Schema

The application uses the following data models:

1. **Faculty**
   - faculty_id: string (primary key)
   - name: string
   - department: string
   - email: string (optional)
   - contact_number: string (optional)

2. **Course**
   - course_code: string (primary key)
   - course_name: string
   - course_type: string (optional)
   - department: string

3. **Room**
   - room_number: string (primary key)
   - building: string (optional)
   - capacity: number (optional)
   - equipment: string (optional)

4. **TimeSlot**
   - slot_id: string (primary key)
   - start_time: string
   - end_time: string

5. **CourseSchedule**
   - schedule_id: string (primary key)
   - course_code: string (foreign key, optional)
   - faculty_id: string (foreign key, optional)
   - room_number: string (foreign key, optional)
   - day_of_week: string
   - time_slot_id: string (foreign key, optional)
   - semester: string (optional)
   - academic_year: string (optional)

6. **User**
   - id: string (primary key)
   - username: string
   - role: 'user' | 'admin'
   - department: string (optional)

## Setup Instructions

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/RDK7159357/tract-tutor-schedule-view.git
   cd tract-tutor-schedule-view
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=tracktutor
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. **Start the development servers**
   ```bash
   # Start the frontend
   npm run dev
   
   # In another terminal, start the backend
   cd backend
   node server.js
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

### Jenkins CI/CD Pipeline

The project includes a Jenkinsfile that defines a CI/CD pipeline with the following stages:

1. Checkout code from repository
2. Install dependencies (frontend and backend)
3. Lint code
4. Build frontend
5. Run tests
6. Deploy frontend to S3 (main branch only)
7. Build and push backend Docker image to ECR (main branch only)
8. Deploy backend to EC2 (main branch only)

## Application Features

### Authentication
- User registration with email verification process
- User login with role-based access (admin/user)
- Google OAuth integration for simplified sign-in
- Email verification error handling with resend capability
- Department selection for users
- Session persistence using local storage

### User Dashboard
- View schedules filtered by department
- Search functionality
- Filter by day of week
- Responsive schedule cards with detailed information

### Admin Dashboard
- Comprehensive management interface
- CRUD operations for:
  - Faculty
  - Courses
  - Rooms
  - Time slots
  - Schedules
- Overview statistics

### Data Handling
- API-first approach with fallback to local data
- Caching for improved performance
- Error handling and loading states

## Component Structure

### Core Components
- **Layout**: Main application layout with header and navigation
- **AuthContext**: Authentication state management
- **ThemeContext**: Theme (dark/light) management

### User Interface
- **LoginForm**: User authentication with email verification checks and resend functionality
- **SignUpForm**: New user registration with email verification process and success notifications
- **DepartmentSelector**: Department selection for users
- **UserDashboard**: Schedule viewing interface for regular users
- **AdminDashboard**: Comprehensive management interface for administrators

### Services
- **apiClient**: Axios-based API communication
- **cacheService**: Client-side data caching
- **dataInitService**: Application data initialization
- **facultyService**: Faculty data management
- **courseService**: Course data management
- **roomService**: Room data management
- **timeSlotService**: Time slot data management
- **scheduleService**: Schedule data management
- **localDataService**: Fallback data provider

## API Endpoints

### Faculty
- GET `/api/faculty`: Get all faculty
- GET `/api/faculty/department/:department`: Get faculty by department
- POST `/api/faculty`: Create new faculty
- PUT `/api/faculty/:id`: Update faculty
- DELETE `/api/faculty/:id`: Delete faculty

### Courses
- GET `/api/courses`: Get all courses
- GET `/api/courses/department/:department`: Get courses by department
- POST `/api/courses`: Create new course
- PUT `/api/courses/:code`: Update course
- DELETE `/api/courses/:code`: Delete course

### Rooms
- GET `/api/rooms`: Get all rooms
- POST `/api/rooms`: Create new room
- PUT `/api/rooms/:number`: Update room
- DELETE `/api/rooms/:number`: Delete room

### Time Slots
- GET `/api/timeslots`: Get all time slots
- POST `/api/timeslots`: Create new time slot
- PUT `/api/timeslots/:id`: Update time slot
- DELETE `/api/timeslots/:id`: Delete time slot

### Schedules
- GET `/api/schedules`: Get all schedules
- GET `/api/schedules/view`: Get schedule view (joined with related entities)
- GET `/api/schedules/department/:department`: Get schedules by department
- POST `/api/schedules`: Create new schedule
- PUT `/api/schedules/:id`: Update schedule
- DELETE `/api/schedules/:id`: Delete schedule

## Deployment Architecture

### Frontend
- Built as static files with Vite
- Served via Nginx in Docker container
- Deployed to AWS S3 bucket

### Backend
- Node.js application in Docker container
- Deployed to AWS EC2 instance
- Docker image stored in AWS ECR

## Recent Enhancements

### Authentication Improvements
- Enhanced email verification workflow for new user registration
- Clear success message after signup instructing users to check their email for verification
- Improved error handling in login form to detect unverified email accounts
- Added "Resend verification email" functionality for users who haven't verified their accounts
- User-friendly error messages with actionable instructions for authentication issues
- Visual distinction between error messages (red) and success messages (green) for better UX

### CRUD Functionality
- Full Create, Read, Update, Delete (CRUD) operations for all entities: Faculty, Courses, Rooms, Time Slots, and Schedules.
- Inline editing and deletion for all entities in the Admin Dashboard.
- All changes are immediately reflected in both the backend (PostgreSQL) and the frontend UI/cache.

### Data Handling & Caching
- All data is now fetched from the backend API; local/mock data has been removed.
- Robust caching mechanism: API data is cached on the frontend and used as a fallback if the backend is unavailable.
- Error fallback and user-friendly error messages for all API operations.

### UI/UX Improvements
- All input fields and dropdowns support both light and dark mode (`dark:text-black` for consistent appearance).
- User-friendly forms with placeholders and validation.
- Inline editing and deletion for all entities, with immediate UI updates.
- (Optional) Confirmation dialogs and notifications for destructive actions (can be further enhanced).

### Backend Enhancements
- Faculty endpoints allow updating the `faculty_id` (primary key) via the API.
- Full CRUD endpoints for schedules, rooms, timeslots, and courses.
- All endpoints return appropriate error messages and status codes.

### Data Verification
- To verify if a new faculty (or any entity) is inserted:
  - Use the API: `GET /api/faculty` (or the relevant endpoint) to fetch all records and check for your entry.
  - Or, connect to the PostgreSQL database and run:
    ```sql
    SELECT * FROM faculty WHERE faculty_id = 'YOUR_ID';
    ```
  - The same applies for courses, rooms, timeslots, and schedules.

### API-First Approach
- All data flows through the backend API, ensuring a single source of truth.
- The frontend never uses stale or local data; all changes are persisted to the database.

### Component & Service Structure
- All CRUD logic is handled via service files (`facultyService.ts`, `courseService.ts`, etc.)
- Caching is managed by `cacheService.ts`.
- UI is split into user and admin dashboards, with role-based access and department filtering.

### Troubleshooting
- If you encounter a NOT NULL constraint error (e.g., for `faculty_id`), ensure the form is filled correctly and the field is not empty.
- All API errors are logged in the browser console and displayed in the UI where appropriate.

## Future Enhancements

1. **Real-Time Faculty Tracking**
   - Implement real-time location/status tracking for faculty members (e.g., using WebSockets or polling).
   - Display live faculty availability and location on the dashboard for admins and users.

2. **Authentication & Authorization Enhancements**
   - Implement password reset functionality for users who forget their passwords
   - Add multi-factor authentication (MFA) for additional security
   - Enhance role-based access control for different user types (admin, faculty, student)
   - Implement session timeout and automatic logout for inactive users
   - Add social login options beyond Google (e.g., Microsoft, Apple)
   - Secure all API endpoints with token-based authentication

3. **Additional Features**
   - Conflict detection for schedule creation.
   - Schedule export functionality (PDF, CSV, etc.).
   - Student view for course schedules.
   - Notifications for schedule changes.

---

This documentation provides a comprehensive overview of the Track Tutor application. For specific implementation details, refer to the source code in the repository.

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
- User login with role-based access (admin/user)
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
- **LoginForm**: User authentication
- **SignUpForm**: New user registration
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

## Future Enhancements

1. Implement real user authentication with JWT
2. Add conflict detection for schedule creation
3. Implement schedule export functionality
4. Add student view for course schedules
5. Implement notifications for schedule changes

---

This documentation provides a comprehensive overview of the Track Tutor application. For specific implementation details, refer to the source code in the repository.
        
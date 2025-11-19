# Complete Project Prompt - Student Course Registration System

## Project Overview
Develop a complete web application for a Student Course Registration System using Node.js, Express, MongoDB, and EJS templating. The application should be deployed on Render cloud platform and feature a modern, vibrant, user-friendly UI.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **View Engine**: EJS
- **Session Management**: Express-session
- **Authentication**: Bcrypt for password hashing
- **Styling**: Custom CSS with vibrant gradients
- **Deployment**: Render.com

## Core Requirements

### 1. Web Pages (Minimum 3)
The application must have at least 3 web pages:
- **Login Page** (`/login`) - User authentication
- **Registration Page** (`/register`) - New user account creation
- **Courses Page** (`/courses`) - View and register for courses

### 2. Database Models

#### User Model (`models/User.js`)
- name (String, required)
- email (String, required, unique, lowercase)
- password (String, required, hashed with bcrypt)
- studentId (String, required, unique)
- semester (Number, default: 1, min: 1, max: 8)
- registeredCourses (Array of ObjectIds referencing Course model)
- timestamps (createdAt, updatedAt)

#### Course Model (`models/Course.js`)
- code (String, required, unique, uppercase)
- name (String, required)
- credits (Number, required, min: 1, max: 4)
- type (String, required, enum: ['Theory', 'Lab'])
- semester (Number, min: 1, max: 8)
- timestamps (createdAt, updatedAt)

### 3. Course Data Requirements

#### Theory Courses (10 Engineering Subjects)
All with credits range 1-4:
1. Data Structures and Algorithms (CS101) - 4 credits, Semester 3
2. Object-Oriented Programming (CS102) - 3 credits, Semester 2
3. Database Management Systems (CS103) - 3 credits, Semester 4
4. Computer Networks (CS104) - 3 credits, Semester 5
5. Software Engineering (CS105) - 3 credits, Semester 6
6. Digital Electronics (EE201) - 4 credits, Semester 3
7. Signals and Systems (EE202) - 4 credits, Semester 4
8. Thermodynamics (ME301) - 3 credits, Semester 5
9. Engineering Mechanics (ME302) - 4 credits, Semester 2
10. Structural Analysis (CE401) - 3 credits, Semester 6

#### Lab Courses (5 courses)
All with 2 credits:
1. Programming Lab (CS151) - 2 credits, Semester 2
2. Database Lab (CS152) - 2 credits, Semester 4
3. Networks Lab (CS153) - 2 credits, Semester 5
4. Electronics Lab (EE251) - 2 credits, Semester 3
5. Mechanical Workshop (ME351) - 2 credits, Semester 5

### 4. Semester System

#### Semester Dropdown Menu
- Must support 8 semesters (Semester 1 through Semester 8)
- User can select their current semester
- Selection persists in database and session

#### Credit Limits by Semester
- Semester 1: 20 credits maximum
- Semester 2: 20 credits maximum
- Semester 3: 22 credits maximum
- Semester 4: 22 credits maximum
- Semester 5: 24 credits maximum
- Semester 6: 24 credits maximum
- Semester 7: 18 credits maximum
- Semester 8: 18 credits maximum

### 5. Course Features

#### Course Sorting
- All courses must be sorted by credits in descending order (highest credits first)
- Sorting applies to both available courses and registered courses sections

#### Registered Courses Section
- Separate section displaying only registered courses
- Shows total number of registered courses
- Shows total credits registered
- Each registered course should have:
  - Course name and code
  - Credits and type (Theory/Lab)
  - Semester information
  - Unregister button

#### Available Courses Section
- Displays all courses not yet registered
- Shows courses sorted by credits (highest first)
- Each course displays:
  - Course name and code
  - Credits and type (Theory/Lab)
  - Semester information
  - Register button (disabled if insufficient credits remaining)

#### Credit Limit Validation
- Prevent registration if adding course would exceed semester credit limit
- Show error message: "Credit limit exceeded! Maximum X credits allowed for Semester Y. Current: Z, Adding: W"
- Disable register button if insufficient credits remaining
- Display credit information prominently:
  - Credit Limit (maximum for selected semester)
  - Registered Credits (with visual warning if exceeded)
  - Remaining Credits (with visual warning if negative)

### 6. User Interface Requirements

#### Design Principles
- **Clean and Vibrant**: Use gradient color schemes
- **User-Friendly**: Intuitive navigation and clear visual feedback
- **Modern**: Contemporary design with smooth animations
- **Responsive**: Works on desktop and mobile devices

#### UI Components Required
1. **Navigation Bar**
   - App name/brand
   - Welcome message with user name
   - Logout button

2. **Semester Selector Section**
   - Dropdown menu for semester selection (1-8)
   - Label: "Select Semester:"
   - Auto-saves on selection change

3. **Credit Information Cards**
   - Three cards in a row:
     - Credit Limit card (with gradient background)
     - Registered Credits card
     - Remaining Credits card
   - Visual indicators for exceeded limits (animation/pulse effect)
   - Numbers displayed prominently

4. **Registered Courses Section**
   - Section header: "📋 My Registered Courses"
   - Subtitle with total courses and credits
   - Grid layout of registered course cards
   - Empty state message if no courses registered

5. **Available Courses Section**
   - Section header: "📚 Available Courses"
   - Subtitle: "Courses sorted by credits (highest first)"
   - Grid layout of course cards
   - Visual distinction between registered and available courses

6. **Course Cards**
   - Card design with hover effects
   - Course name as heading
   - Course code badge
   - Type badge (Theory/Lab) with different colors
   - Credits display
   - Semester display (if available)
   - Action buttons (Register/Unregister)
   - Checkmark indicator for registered courses

#### Color Scheme
- Primary: Gradient from #6366f1 to #8b5cf6
- Success: #10b981 (green)
- Danger: #ef4444 (red)
- Background: Gradient from #667eea to #764ba2

### 7. Routes and Functionality

#### Authentication Routes
- `GET /` - Redirects to /login or /courses based on session
- `GET /login` - Display login page
- `POST /login` - Authenticate user, create session, redirect to /courses
- `GET /register` - Display registration page
- `POST /register` - Create new user account, create session, redirect to /courses
- `GET /logout` - Destroy session, redirect to /login

#### Course Routes
- `GET /courses` - Display courses page (requires authentication)
  - Show semester selector
  - Show credit information
  - Show registered courses section
  - Show available courses section
  - Pass data: courses, registeredCourses, userName, semester, creditLimit, totalCredits, remainingCredits
- `POST /register-course/:courseId` - Register for a course (requires authentication)
  - Validate credit limit
  - Add course to user's registeredCourses array
  - Return JSON response
- `POST /unregister-course/:courseId` - Unregister from a course (requires authentication)
  - Remove course from user's registeredCourses array
  - Return JSON response
- `POST /update-semester` - Update user's semester (requires authentication)
  - Validate semester (1-8)
  - Update user model
  - Update session
  - Return JSON response

#### Utility Routes
- `GET /init-courses` - Initialize courses database (run once)
  - Check if courses exist
  - Insert all 15 courses if empty
  - Return success message

### 8. Session Management
- Use express-session for session management
- Session secret from environment variable or default
- Session cookie: 24 hours expiration
- Store userId, userName, and semester in session

### 9. Environment Configuration

#### .env File Required
Create `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/course_registration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production-12345
PORT=3000
```

For production (Render), use MongoDB Atlas connection string.

### 10. Dependencies (package.json)
```json
{
  "name": "student-course-registration",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "express-session": "^1.17.3",
    "body-parser": "^1.20.2",
    "ejs": "^3.1.9"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 11. File Structure
```
Course_Reg/
├── models/
│   ├── User.js          # User schema with semester and registeredCourses
│   └── Course.js        # Course schema with credits, type, semester
├── views/
│   ├── login.ejs        # Login page template
│   ├── register.ejs     # Registration page template
│   └── courses.ejs      # Courses page with registered/available sections
├── public/
│   └── css/
│       └── style.css    # All styling with gradients and animations
├── server.js            # Express server with all routes and middleware
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── render.yaml         # Render deployment configuration
└── README.md           # Documentation
```

### 12. Additional Features

#### Error Handling
- Try-catch blocks for all async operations
- User-friendly error messages
- Console logging for debugging
- Graceful error responses

#### Client-Side JavaScript
- AJAX calls for course registration/unregistration
- Semester update without page reload
- Message notifications (success/error)
- Auto-refresh after actions

#### Security Features
- Password hashing with bcrypt (10 rounds)
- Session-based authentication
- Protected routes with requireAuth middleware
- Email uniqueness validation
- Student ID uniqueness validation

#### Visual Feedback
- Success messages (green)
- Error messages (red)
- Loading states
- Disabled buttons with tooltips
- Animations and transitions
- Hover effects on cards

### 13. Deployment Requirements

#### Render.com Configuration
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node
- Environment Variables:
  - MONGODB_URI (MongoDB Atlas connection string)
  - SESSION_SECRET (secure random string)
  - NODE_ENV=production
  - PORT (auto-set by Render)

#### render.yaml
```yaml
services:
  - type: web
    name: course-registration-system
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: SESSION_SECRET
        sync: false
      - key: PORT
        value: 3000
```

### 14. Implementation Checklist

- [x] Set up Express server with middleware
- [x] Configure MongoDB connection with error handling
- [x] Create User and Course Mongoose models
- [x] Implement authentication (login/register/logout)
- [x] Create login page with form
- [x] Create registration page with form
- [x] Create courses page with registered/available sections
- [x] Implement semester dropdown (1-8)
- [x] Implement credit limit system per semester
- [x] Implement course sorting (highest credits first)
- [x] Implement course registration with credit validation
- [x] Implement course unregistration
- [x] Implement semester update functionality
- [x] Create vibrant CSS with gradients
- [x] Add responsive design for mobile
- [x] Add animations and visual feedback
- [x] Create course initialization route
- [x] Set up environment variables
- [x] Create deployment configuration
- [x] Add comprehensive error handling

### 15. Testing Steps
1. Start MongoDB (local or Atlas)
2. Run `npm install`
3. Start server: `npm start`
4. Visit `/init-courses` to populate database
5. Register a new user account
6. Login with credentials
7. Select a semester from dropdown
8. View credit information
9. Register for courses (test credit limit)
10. View registered courses section
11. Unregister from a course
12. Change semester and verify credit limits update

---

## Complete Prompt Summary

**Create a Student Course Registration System web application with the following specifications:**

Build a Node.js/Express application using MongoDB and EJS that allows students to register for courses. Include 3 pages: login, registration, and courses. Implement a semester system (8 semesters) with varying credit limits (20-24 credits based on semester). Add 10 engineering theory courses (1-4 credits) and 5 lab courses (2 credits each) with semester assignments. 

Create a courses page with two sections: registered courses and available courses. Courses must be sorted by credits (highest first). Implement a semester dropdown that updates credit limits. Display credit information (limit, registered, remaining) with visual warnings when limits are exceeded. 

Add credit limit validation that prevents registration if limits would be exceeded. Use a vibrant gradient UI design with animations. Include session-based authentication with bcrypt password hashing. Make it responsive and deployable on Render with MongoDB Atlas.

All course data should be initialized via `/init-courses` route. The registered courses section should show separately from available courses. Include all error handling, client-side AJAX for seamless interactions, and comprehensive styling that makes the UI clean, vibrant, and user-friendly.


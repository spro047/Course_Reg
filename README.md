# Student Course Registration System

A modern, user-friendly web application for student course registration built with Node.js, Express, MongoDB, and EJS.

## Features

- **User Authentication**: Secure login and registration system
- **Course Browsing**: View all available courses with details
- **Course Registration**: Register and unregister from courses
- **Beautiful UI**: Clean, vibrant, and responsive design
- **10 Engineering Subjects**: Pre-loaded with various engineering courses
- **Lab Courses**: Includes lab subjects with appropriate credits

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **View Engine**: EJS
- **Session Management**: Express-session
- **Authentication**: Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Clone the repository or download the files

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/course_registration
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production-12345
   PORT=3000
   ```
   - For local development, MongoDB URI defaults to `mongodb://localhost:27017/course_registration`
   - For production, update `MONGODB_URI` with your MongoDB Atlas connection string
   - Update `SESSION_SECRET` with a secure random string
   - Note: The app will work without `.env` file using default values for local development

4. Start MongoDB (if using local MongoDB):
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# On macOS/Linux
mongod
```

5. Initialize the courses database:
   - Start the server: `npm start`
   - Visit `http://localhost:3000/init-courses` to populate courses
   - This only needs to be done once

6. Run the application:
```bash
npm start
```

7. Open your browser and navigate to:
```
http://localhost:3000
```

## Deployment on Render

1. **Create a MongoDB Database**:
   - Sign up for MongoDB Atlas (free tier available)
   - Create a new cluster and database
   - Get your connection string

2. **Deploy on Render**:
   - Sign up/login to Render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository (or upload files)
   - Use these settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Set Environment Variables in Render**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SESSION_SECRET`: A random secure string
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (Render sets this automatically)

4. **Deploy**:
   - Click "Create Web Service"
   - After deployment, visit the URL to access your app
   - Don't forget to visit `/init-courses` to populate courses

## Available Courses

### Theory Courses (10 courses)
1. Data Structures and Algorithms (CS101) - 4 credits
2. Object-Oriented Programming (CS102) - 3 credits
3. Database Management Systems (CS103) - 3 credits
4. Computer Networks (CS104) - 3 credits
5. Software Engineering (CS105) - 3 credits
6. Digital Electronics (EE201) - 4 credits
7. Signals and Systems (EE202) - 4 credits
8. Thermodynamics (ME301) - 3 credits
9. Engineering Mechanics (ME302) - 4 credits
10. Structural Analysis (CE401) - 3 credits

### Lab Courses
1. Programming Lab (CS151) - 2 credits
2. Database Lab (CS152) - 2 credits
3. Networks Lab (CS153) - 2 credits
4. Electronics Lab (EE251) - 2 credits
5. Mechanical Workshop (ME351) - 2 credits

## Project Structure

```
Course_Reg/
├── models/
│   ├── User.js          # User model
│   └── Course.js        # Course model
├── views/
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
│   └── courses.ejs      # Courses listing page
├── public/
│   └── css/
│       └── style.css    # Main stylesheet
├── server.js             # Main server file
├── package.json         # Dependencies
├── .env                 # Environment variables
├── render.yaml          # Render deployment config
└── README.md            # This file
```

## Usage

1. **Register a New Account**:
   - Click "Register here" on the login page
   - Fill in your details (Name, Student ID, Email, Password)
   - Submit the form

2. **Login**:
   - Enter your email and password
   - Click "Sign In"

3. **Browse Courses**:
   - After login, you'll see all available courses
   - Each course shows: name, code, credits, and type (Theory/Lab)

4. **Register for Courses**:
   - Click "Register Now" on any course
   - Registered courses will show "✓ Registered" button
   - You can unregister by clicking "Unregister"

5. **Logout**:
   - Click the "Logout" button in the top right

## Security Features

- Password hashing using bcryptjs
- Session-based authentication
- Secure password requirements
- Email validation

## License

ISC


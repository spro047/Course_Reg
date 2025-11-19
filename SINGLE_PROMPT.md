# Single Prompt to Recreate the Entire Project

## Copy and paste this entire prompt:

---

**Create a complete Student Course Registration System web application with the following exact specifications:**

### Technology Stack
- Node.js with Express.js
- MongoDB with Mongoose
- EJS templating engine
- Express-session for authentication
- Bcrypt for password hashing
- Custom CSS with vibrant gradients
- Deployable on Render.com

### Core Pages (3 minimum)
1. **Login Page** (`/login`) - Email and password authentication
2. **Registration Page** (`/register`) - New user signup with name, email, password, studentId
3. **Courses Page** (`/courses`) - Main page showing registered and available courses

### Database Models
**User Model**: name, email, password (hashed), studentId (unique), semester (1-8, default 1), registeredCourses (array of Course ObjectIds), timestamps

**Course Model**: code (unique, uppercase), name, credits (1-4), type ('Theory' or 'Lab'), semester (1-8), timestamps

### Course Data (15 courses total)
**Theory Courses (10):**
- Data Structures and Algorithms (CS101) - 4 credits, Semester 3
- Object-Oriented Programming (CS102) - 3 credits, Semester 2
- Database Management Systems (CS103) - 3 credits, Semester 4
- Computer Networks (CS104) - 3 credits, Semester 5
- Software Engineering (CS105) - 3 credits, Semester 6
- Digital Electronics (EE201) - 4 credits, Semester 3
- Signals and Systems (EE202) - 4 credits, Semester 4
- Thermodynamics (ME301) - 3 credits, Semester 5
- Engineering Mechanics (ME302) - 4 credits, Semester 2
- Structural Analysis (CE401) - 3 credits, Semester 6

**Lab Courses (5):**
- Programming Lab (CS151) - 2 credits, Semester 2
- Database Lab (CS152) - 2 credits, Semester 4
- Networks Lab (CS153) - 2 credits, Semester 5
- Electronics Lab (EE251) - 2 credits, Semester 3
- Mechanical Workshop (ME351) - 2 credits, Semester 5

### Semester System & Credit Limits
- Dropdown menu with 8 semesters (Semester 1-8)
- Credit limits: Sem 1-2: 20, Sem 3-4: 22, Sem 5-6: 24, Sem 7-8: 18
- User can select semester, stored in database and session
- Credit limit enforced when registering courses
- Display three cards: Credit Limit, Registered Credits, Remaining Credits
- Visual warnings (pulse animation) when limits exceeded

### Course Features
- **Sorting**: All courses sorted by credits in descending order (highest first)
- **Registered Courses Section**: Separate section at top showing only registered courses with total count and credits
- **Available Courses Section**: Shows unregistered courses below
- **Credit Validation**: Prevent registration if exceeding limit with clear error message
- **Visual Indicators**: Registered courses have checkmark badge and green border

### UI Design Requirements
- **Vibrant Gradients**: Background gradient (#667eea to #764ba2), primary buttons gradient (#6366f1 to #8b5cf6)
- **Course Cards**: Hover effects, shadow animations, color-coded badges for Theory/Lab
- **Responsive**: Mobile-friendly grid layout
- **Modern**: Smooth transitions, pulse animations for warnings
- **Clean Layout**: Organized sections with clear headers and subtitles

### Routes Required
- `GET /` - Redirect to /login or /courses
- `GET /login` - Show login form
- `POST /login` - Authenticate, create session, redirect to /courses
- `GET /register` - Show registration form
- `POST /register` - Create account, hash password, create session
- `GET /logout` - Destroy session, redirect
- `GET /courses` - Main courses page (requireAuth middleware)
- `POST /register-course/:courseId` - Register for course (AJAX, validate credits)
- `POST /unregister-course/:courseId` - Unregister (AJAX)
- `POST /update-semester` - Update semester (AJAX)
- `GET /init-courses` - Initialize all 15 courses in database

### Security & Features
- Password hashing with bcrypt (10 rounds)
- Session-based authentication with requireAuth middleware
- Email and studentId uniqueness validation
- Error handling with try-catch blocks
- Client-side AJAX for seamless interactions
- Success/error message notifications

### Environment Setup
- `.env` file: MONGODB_URI, SESSION_SECRET, PORT=3000
- `package.json` with all dependencies
- `render.yaml` for Render deployment
- `.gitignore` to exclude node_modules and .env

### File Structure
```
Course_Reg/
├── models/
│   ├── User.js
│   └── Course.js
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   └── courses.ejs
├── public/css/
│   └── style.css
├── server.js
├── package.json
├── .env
└── render.yaml
```

### Implementation Details
- Express middleware: bodyParser, session, static files
- MongoDB connection with error handling
- EJS view engine configuration
- Credit calculation: sum of registered course credits
- Semester credit limit function
- Course sorting: `Course.find().sort({ credits: -1 })`
- Registered courses: populate user's registeredCourses array
- Credit validation: Check if (currentCredits + newCourseCredits > limit)
- Visual feedback: Disable register button if insufficient credits

**Create all files, implement all features, ensure everything is connected and working. Use vibrant modern UI, comprehensive error handling, and make it production-ready for Render deployment.**

---


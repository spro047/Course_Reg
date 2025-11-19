const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


// Import models
const User = require('./models/User');
const Course = require('./models/Course');

// Credit limits based on semester
const getCreditLimit = (semester) => {
  const limits = {
    1: 20,
    2: 20,
    3: 22,
    4: 22,
    5: 24,
    6: 24,
    7: 18,
    8: 18
  };
  return limits[semester] || 20;
};

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Routes
// Home/Login Page
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/courses');
  }
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/courses');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.semester = user.semester || 1;
    res.redirect('/courses');
  } catch (error) {
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
});

// View Courses Page
app.get('/courses', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('registeredCourses');
    let courses = await Course.find().sort({ credits: -1 }); // Sort by credits (highest first)
    
    const currentSemester = user.semester || 1;
    const creditLimit = getCreditLimit(currentSemester);
    
    // Calculate total registered credits
    const totalCredits = user.registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    
    res.render('courses', { 
      courses, 
      registeredCourses: user.registeredCourses || [],
      userName: req.session.userName,
      semester: currentSemester,
      creditLimit: creditLimit,
      totalCredits: totalCredits,
      remainingCredits: creditLimit - totalCredits
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading courses');
  }
});

// Register for a Course
app.post('/register-course/:courseId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('registeredCourses');
    const courseId = req.params.courseId;
    
    if (user.registeredCourses.some(c => c._id.toString() === courseId)) {
      return res.json({ success: false, message: 'Course already registered' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: 'Course not found' });
    }
    
    // Calculate current total credits
    const totalCredits = user.registeredCourses.reduce((sum, c) => sum + c.credits, 0);
    const creditLimit = getCreditLimit(user.semester || 1);
    
    // Check if adding this course would exceed credit limit
    if (totalCredits + course.credits > creditLimit) {
      return res.json({ 
        success: false, 
        message: `Credit limit exceeded! Maximum ${creditLimit} credits allowed for Semester ${user.semester || 1}. Current: ${totalCredits}, Adding: ${course.credits}` 
      });
    }
    
    user.registeredCourses.push(courseId);
    await user.save();
    
    res.json({ success: true, message: 'Course registered successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error registering course' });
  }
});

// Unregister from a Course
app.post('/unregister-course/:courseId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const courseId = req.params.courseId;
    
    user.registeredCourses = user.registeredCourses.filter(
      id => id.toString() !== courseId
    );
    await user.save();
    
    res.json({ success: true, message: 'Course unregistered successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error unregistering course' });
  }
});

// Update Semester
app.post('/update-semester', requireAuth, async (req, res) => {
  try {
    const { semester } = req.body;
    const semesterNum = parseInt(semester);
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.json({ success: false, message: 'Invalid semester' });
    }
    
    const user = await User.findById(req.session.userId);
    user.semester = semesterNum;
    await user.save();
    
    req.session.semester = semesterNum;
    res.json({ success: true, message: 'Semester updated successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error updating semester' });
  }
});

// Registration Page (for new users)
app.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/courses');
  }
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'Email already registered' });
    }
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      studentId,
      semester: 1
    });
    
    await user.save();
    
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.semester = user.semester || 1;
    res.redirect('/courses');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'An error occurred. Please try again.' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Initialize courses (run once to populate database)
app.get('/init-courses', async (req, res) => {
  try {
    const coursesCount = await Course.countDocuments();
    if (coursesCount > 0) {
      return res.send('Courses already initialized');
    }
    
    const courses = [
      { code: 'CS101', name: 'Data Structures and Algorithms', credits: 4, type: 'Theory', semester: 3 },
      { code: 'CS102', name: 'Object-Oriented Programming', credits: 3, type: 'Theory', semester: 2 },
      { code: 'CS103', name: 'Database Management Systems', credits: 3, type: 'Theory', semester: 4 },
      { code: 'CS104', name: 'Computer Networks', credits: 3, type: 'Theory', semester: 5 },
      { code: 'CS105', name: 'Software Engineering', credits: 3, type: 'Theory', semester: 6 },
      { code: 'EE201', name: 'Digital Electronics', credits: 4, type: 'Theory', semester: 3 },
      { code: 'EE202', name: 'Signals and Systems', credits: 4, type: 'Theory', semester: 4 },
      { code: 'ME301', name: 'Thermodynamics', credits: 3, type: 'Theory', semester: 5 },
      { code: 'ME302', name: 'Engineering Mechanics', credits: 4, type: 'Theory', semester: 2 },
      { code: 'CE401', name: 'Structural Analysis', credits: 3, type: 'Theory', semester: 6 },
      { code: 'CS151', name: 'Programming Lab', credits: 2, type: 'Lab', semester: 2 },
      { code: 'CS152', name: 'Database Lab', credits: 2, type: 'Lab', semester: 4 },
      { code: 'CS153', name: 'Networks Lab', credits: 2, type: 'Lab', semester: 5 },
      { code: 'EE251', name: 'Electronics Lab', credits: 2, type: 'Lab', semester: 3 },
      { code: 'ME351', name: 'Mechanical Workshop', credits: 2, type: 'Lab', semester: 5 }
    ];
    
    await Course.insertMany(courses);
    res.send('Courses initialized successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error initializing courses');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();

// Use the 'dev' preset for Morgan logging
app.use(morgan('dev'));
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const researchRoutes = require('./routes/researchRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { checkUser } = require('./middleware/authMiddleware');
const { render } = require('ejs');




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
console.log(process.env.MONGODB_URI);  // To debug and make sure the value is correct


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Routes
app.get('*', checkUser);
app.use('/', authRoutes);
app.use('/research', researchRoutes);
app.use('/profile', profileRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
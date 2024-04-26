const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const maxAgeExpiredIn = 20 * 24 * 60 * 60  // 20 days

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAgeExpiredIn
  });
};

// const signUp = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     // Check if the user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     // Create new user
//     user = new User({ name, email, password });
//     await user.save();
//     const token = createToken(user._id);
//     res.cookie('jwt', token, {
//       httpOnly: true,
//       maxAge: maxAgeExpiredIn * 1000
//     });
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };


// const logUserIn = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // login static method
//     const user = await User.login(email, password)
//     // create a jwt token
//     const token = createToken(user._id);
//     //  return the token
//     res.cookie('jwt', token, {
//       httpOnly: true,
//       maxAge: maxAgeExpiredIn * 1000
//     })
//     res.status(200).json({user})
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).json({ message: error.message });
//   }


// };
const signUp = async (req, res) => {
  const { name, email, password, avatar } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    user = new User({ name, email, password, avatar });
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: maxAgeExpiredIn * 100 },
      (err, token) => {
        if (err) {
          console.error("JWT Error:", err);
          return res.status(500).json({ message: "Failed to generate JWT token" });
        }
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error("Signup Error:", error.message);
    let errorMessage = '';
    if (error.errors) {
      errorMessage = Object.values(error.errors).map(error => error.message).join(', ');
    } else {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};



// login controller
const logUserIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: maxAgeExpiredIn },
      (err, token) => {
        if (err) throw err;
        // Send user data along with the token
        res.status(200).json({ token, user });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// logout controller
const logout = async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie('jwt');
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem('user');
    // Send logout success message
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, logUserIn, logout, getUser };

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  try {
    // get the token
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/log-in')
        } else {
          console.log(decodedToken);
          next();
        }
      })
    } else {
      res.redirect('/log-in')
    }
  } catch (error) {

  }
}
// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};





const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'Authorization Denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object to the request
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { requireAuth, authMiddleware, checkUser }

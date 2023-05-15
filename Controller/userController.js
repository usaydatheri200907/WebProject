const jwt = require("jsonwebtoken")
const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const bearerToken = authHeader.split(' ')[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
}


const signup = async (req , res) => {
  const { username, password, name, phone, role } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    //get the salt from bcrypt and hash the password with the salt and the password provided by the user in the request body 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      name,
      phone,
      role
    });
    await user.save();

    res.status(200).json({ success: true, message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

const login = async (req, res) => {
    const { username, password } = req.body;
  console.log(req.body)
    try {
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Create and sign a JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '24h' });
  
      res.status(200).json({ success: true, message: 'User logged in successfully', user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

module.exports = { signup, login };
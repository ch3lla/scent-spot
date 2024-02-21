// eslint-disable-next-line no-unused-vars
const { request, response } = require('express');
const User = require('../models/User');

/**
 * Handles registration logic
 * @param { request } req
 * @param { response } res
 */
const register = async (req, res) => {
  const userInfo = req.body;
  const alreadyExists = await User.findOne({ email: req.body.email });
  if (alreadyExists) {
    res.status(400).json({ message: 'This email belongs to an account.' });
    return;
  }

  try {
    if (typeof userInfo !== 'object' || Object.keys(userInfo).length === 0) {
      res.status(400).json({ message: 'Please fill all the required fields' });
      return;
    }
    const newUser = new User(userInfo);
    const token = await newUser.generateAuthToken();
    await newUser.save();
    res.status(201).json({ token });
  } catch (Error) {
    res.status(500).json({ Error: Error._message });
  }
};

/**
 * Handles login logic
 * @param { request } req
 * @param { response } res
 */
const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    if (!user) {
      res.status(400).send(user.error);
      return;
    }
    const token = await user.generateAuthToken();
    console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === 'This email has not been registered on our system.') {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Invalid password') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

module.exports = { register, login };

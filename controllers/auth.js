import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import { unauthorized } from '../lib/errorHandler.js'
import { secret } from '../config/environment.js'

async function registerUser(req, res, next) {
  try {
    const newUser = await User.create(req.body)
    const token = jwt.sign({ sub: newUser._id }, secret, { expiresIn: '14 days' })
    return res.status(201).json({ message: `Welcome ${newUser.email}`, token })
  } catch (err) {
    next(err)
  }
}

async function loginUser(req, res, next) {
  try {
    const userToLogin = await User.findOne({ email: req.body.email })
    if (!userToLogin || !userToLogin.validatePassword(req.body.password)) {
      throw new Error(unauthorized)
    }
    const token = jwt.sign({ sub: userToLogin._id }, secret, { expiresIn: '14 days' })
    return res.status(202).json({ message: `Welcome back ${userToLogin.email}`, token })
  } catch (err) {
    next(err)
  }
}

export default {
  registerUser,
  loginUser,
}
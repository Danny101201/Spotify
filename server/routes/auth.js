import express from 'express';
import bcrypt from 'bcrypt';
import User from '../module/User.js';
import { generateRefreshTokens } from '../utils/generateRefreshToken.js'
import { validateUserSignIn } from '../utils/validationSchema.js';

const router = express.Router();
router.post('/',async (req, res) => {
  const { error } = await validateUserSignIn(req.body)
  if(error) return res.status(400).json({message:'please add your email and password'})
  const user = await User.findOne({email: req.body.email});
  if (!user)return res.status(400).json({message:'Invalid email or password'}) 
  const validataPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validataPassword) return res.status(400).json({ message: 'Invalid email or password' })

  const {refreshtoken} = await generateRefreshTokens(user)
  
  res.status(200).json({ refreshtoken,message: 'Sign in successfully' })
})
export default router
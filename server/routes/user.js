import express from 'express';
import bcrypt from 'bcrypt';
import User from '../module/User.js';
import {validateUserSignUp} from '../utils/validationSchema.js';
import isAdmin from '../middleware/admin.js';
import isAuth from '../middleware/auth.js';
import validObjectId from '../middleware/validObjectId.js';
const router = express.Router();
router.post('/',async (req, res) => {
  try {
    const { error } = validateUserSignUp(req.body);
    if(error) return res.status(400).json({message:error.details[0].message})
    const user = await User.findOne({email:req.body.email})
    if(user)return res.status(403).send({message:"Email has been register"})
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hash_password = await bcrypt.hash(req.body.password, salt);
    let newUser = await new User({
      ...req.body,
      password:hash_password
    }).save()
    
    newUser.password = undefined
    newUser._v=undefined
    res.status(200).json({ data: newUser ,message:'Account created successfully'})
  }catch(err){
    console.log(err)
    res.status(500).json({message:'server error'})
  }
});
router.get('/', isAdmin, async (req, res, next) => {
  const users = await User.find().select("-password-_v")
  res.status(200).send({ data: users })
})
// get user by id
router.get('/:id', [validObjectId, isAuth], async (req, res, next) => {

  const user = await User.findById(req.params.id).select("-password-_v")
  res.status(200).send({ data: user })
})
// update user by id
router.patch('/:id', [validObjectId, isAuth], async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select("-password-_v")
  res.status(200).send({ data: user })
})
// delete user by id
router.delete('/:id', [validObjectId, isAuth], async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)
  res.status(200).send({ data: 'successfully delete users' })
})
export default router
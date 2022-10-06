import express from 'express';
import bcrypt from 'bcrypt';
import User from '../module/User.js';
import {validateUserSignUp} from '../utils/validationSchema.js';

const router = express.Router();
router.post('/',async (req, res) => {
  try{

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
export default router
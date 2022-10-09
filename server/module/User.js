import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name:{type:String, required:true},
  email:{type:String, required:true},
  password:{type:String, required:true},
  gender: {
    type: String, 
    enum: ["male", "female","non-binary"],
    required:true
  },
  month:{type:String, required:true},
  date:{type:String, required:true},
  year:{type:String, required:true},
  likeSongs:{type:[String], default:[]},
  playlists:{type:[String], default:[]},
  isAdmin: { type: Boolean, default: false, required: false },
})

userSchema.methods.generateAuthToken=async function(){
  const payload = { _id: this.name, name: this.name, isAdmin: this.isAdmin }
  const token = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    { expiresIn: '7d' }
  )
  return token
}




export default mongoose.model("User", userSchema)
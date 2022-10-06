import mongoose from "mongoose";


const ObjectId = mongoose.Schema.Types.ObjectId;

const playListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userID: { type: ObjectId, ref: "User", required: true },
  desc: { type: String },
  songs:{type:Array,default:[]},
  img: { type: String},
})

export default mongoose.model("PlayList", playListSchema)
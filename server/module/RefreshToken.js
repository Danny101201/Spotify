import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, required: true },
  refreshtoken: { type: String, required: true }
});

export default mongoose.model('Token', tokenSchema)
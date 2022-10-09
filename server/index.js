import express from 'express';
import * as dotenv from 'dotenv' 
import { connectDb } from './db/connection.js';
import cors from 'cors'
import userRoute from './routes/user.js';
import authRoute from './routes/auth.js';
import songRoute from './routes/songs.js';
import playlistRoute from './routes/playlist.js';
import searchRoute from './routes/search.js';
dotenv.config()
const app = express();

app.use(express.json());
app.use(cors())
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/song', songRoute)
app.use('/api/playList', playlistRoute)
app.use('/api/search', searchRoute)

app.listen(process.env.PORT,async()=>{
  connectDb();
  console.log('server listening on port : '+process.env.PORT);
})

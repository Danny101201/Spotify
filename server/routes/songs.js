import express, { json } from 'express';
import User from '../module/User.js';
import Song from '../module/Song.js';
import { validateSongInfo } from '../utils/validationSchema.js';
import isAdmin from '../middleware/admin.js';
import isAuth from '../middleware/auth.js';
import validObjectId from '../middleware/validObjectId.js';
const router = express.Router();
// add song
router.post('/', isAdmin, async (req, res, next) => {
  const { error } = validateSongInfo(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })
  const duplicateSong = await Song.find({ name: req.body.name })
  if (duplicateSong.length > 0) {
    return res.status(400).json({ message: 'song already exists' })
  }
  const song = await new Song(req.body).save();
  return res.status(200).json({ data: song, message: 'Song created successfully' })
});
// get all song
router.get('/', isAdmin, async (req, res, next) => {
  const songs = await Song.find()
  return res.status(200).json({ data: songs })
});

// update song by id
router.patch('/:id', [validObjectId, isAdmin], async (req, res, next) => {
  const song = await Song.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
  res.status(200).send({ data: song, message: 'Song updated successfully' })
})

// delete song by id
router.delete('/:id', [validObjectId, isAdmin], async (req, res, next) => {
  const song = await Song.findByIdAndDelete(req.params.id)
  res.status(200).send({ data: 'successfully delete song' })
})
// like song by id
router.put('/like/:id', [validObjectId, isAuth], async (req, res, next) => {
  let resMessage = ''
  const song = await Song.findById(req.params.id)
  if (!song) return res.status(400).send({ message: "song does not exist" })
  const user = await User.findById(req.user._id)
  const index = user.likeSongs.indexOf(song._id)
  if (index === -1) {
    user.likeSongs.push(song._id)
    resMessage = 'Added to your liked songs'
  } else {
    user.likeSongs.splice(index, 1)
    resMessage = 'removed to your liked songs'
  }
  await user.save()
  return res.status(200).send({ message: resMessage })
})
// get all like song
router.get('/like', isAuth, async (req, res, next) => {
  const user = await User.findById(req.user._id)
  // const songs = await Song.find().where('_id').in(user.likeSongs).exec()
  const songs = await Song.find({ _id: user.likeSongs })
  if (!songs) return res.status(404).send({ message: 'song has been deleted' })
  res.status(200).send({ data: songs })

})
export default router
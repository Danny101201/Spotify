import express, { json } from 'express';
import User from '../module/User.js';
import Song from '../module/Song.js';
import PlayList from '../module/PlayList.js';
import { validatePlayListInfo, validateUpdatePlayListInfo, validateAddSongToPlayListInfo } from '../utils/validationSchema.js';

import isAuth from '../middleware/auth.js';
import validObjectId from '../middleware/validObjectId.js';

const router = express.Router();

//create playList
router.post('/', isAuth, async (req, res) => {
  const { error } = validatePlayListInfo(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findById(req.user._id)
  const playlist = await new PlayList({ ...req.body, userID: user._id }).save()
  user.playlists.push(playlist._id)
  await user.save()
  return res.status(200).json({ data: playlist })
})
//edid playList
router.put('/edit/:id', [isAuth, validObjectId], async (req, res) => {
  const { error } = validateUpdatePlayListInfo(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })

  const playlist = await PlayList.findById(req.params.id)
  const user = await User.findById(req.user._id)
  if (!playlist) return res.status(400).json({ message: 'Playlist not found' })
  if (!user._id.equals(playlist.userID)) return res.status(403).json({ message: 'User do not have access to edit' })
  const updatePlaylist = await PlayList.findByIdAndUpdate(req.params.id, {
    $set: req.body
  })

  return res.status(200).json({ message: 'update successfully' })
})
//add songs to  playList
router.put('/add_song', isAuth, async (req, res) => {
  const { error } = validateAddSongToPlayListInfo(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })

  const playlist = await PlayList.findById(req.body.playlistId)
  const user = await User.findById(req.user._id)
  if (!playlist) return res.status(400).json({ message: 'Playlist not found' })
  if (!user._id.equals(playlist.userID)) return res.status(403).json({ message: 'User do not have access to add' })
  const updatePlaylist = await PlayList.findByIdAndUpdate(req.body.playlistId, {
    $set: {
      songs: [...playlist.songs, req.body.songId]
    }
  })
  return res.status(200).send({ data: playlist, message: "Added to playlist" });
})

//remove songs to  playLis
router.put('/remove_song', isAuth, async (req, res) => {
  const { error } = validateAddSongToPlayListInfo(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })

  const playlist = await PlayList.findById(req.body.playlistId)
  const user = await User.findById(req.user._id)
  if (!playlist) return res.status(400).json({ message: 'Playlist not found' })
  if (!user._id.equals(playlist.userID)) return res.status(403).json({ message: 'User do not have access to remove' })
  const updatePlaylist = await PlayList.findByIdAndUpdate(req.body.playlistId, {
    $set: {
      songs: playlist.songs.filter(songId => songId !== req.body.songId)
    }
  })
  return res.status(200).send({ data: playlist, message: "Removed from playlist" });
})

// user playlists
router.get('/favourite', isAuth, async (req, res) => {
  const user = await User.findById(req.user._id)
  const playlists = await PlayList.find({ userID: user._id })
  return res.status(200).send({ data: playlists });
})
// get random playlists
router.get('/random', isAuth, async (req, res) => {
  const playlists = await PlayList.aggregate([{ $sample: { size: 10 } }]);
  return res.status(200).send({ data: playlists });
})

// get playlist by id
router.get("/:id", [validObjectId, isAuth], async (req, res) => {
  const playlist = await PlayList.findById(req.params.id);
  if (!playlist) return res.status(404).send("not found");

  const songs = await Song.find({ _id: playlist.songs });
  return res.status(200).send({ data: { playlist, songs } });
});
// get all playlist
router.get('/', isAuth, async (req, res) => {
  const playlists = await PlayList.find();
  return res.status(200).send({ data: playlists });
})
// delete  playlist by id
router.delete('/:id', isAuth, async (req, res) => {
  const playlist = await PlayList.findById(req.params.id);
  const user = await User.findById(req.user._id)
  if (!playlist) return res.status(400).json({ message: 'Playlist not found' })
  if (!user._id.equals(playlist.userID)) return res.status(403).json({ message: 'User do not have access to remove' })
  await PlayList.findByIdAndDelete(req.params.id);
  const updateUser = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      playlists: user.playlists.filter(playlistId => playlistId !== playlist._id)
    }
  })

  return res.status(200).send({ message: "Removed from library" });
})

export default router
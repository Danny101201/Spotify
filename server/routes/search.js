import express from 'express';

import Song from '../module/Song.js';
import PlayList from '../module/PlayList.js';

import isAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  const search = req.query.search
  if (search !== undefined) {
    const songs = await Song.find({
      name: { $regex: search, $options: "i" }
    }).limit(10)
    const playList = await PlayList.find({
      name: { $regex: search, $options: "i" }
    }).limit(10)
    return res.status(200).json({
      data: {
        songs,
        playList
      }
    })
  } else {
    res.status(200).send({})
  }
})

export default router
const path = require('path')
const express = require('express')
const LyricsService = require('./lyric-service')
const LyricsRouter = express.Router()
const bodyParser = express.json()
const xss = require('xss')

const { v4: uuid } = require('uuid')

const logger = require('../logger')
const lyricData = require('../store')



LyricsRouter
  .route('/')
  .get((req, res, next) => {
    LyricsService.getAllLyrics(req.app.get('db'))
      .then(lyrics => {
        res.json(lyrics)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { title, genre, mood, artist, lyrics } = req.body;
    const newLyrics = { title, genre, mood, artist, lyrics }
    for (const [key, value] of Object.entries(newLyrics)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    LyricsService.insertLyrics(
      req.app.get('db'),
      newLyrics
    )
      .then(lyrics => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${lyrics.id}`))
          .json(lyrics)
      })
      .catch(next)
    // logger.info(`Lyrics with id ${lyrics.id} created`);
  })

//     lyricData.push(newLyrics);

//     logger.info(`Lyrics with id ${id} created`);

//     res
//       .status(201)
//       .location(`http://localhost:8000/lyrics/${id}`)
//       .json({id});
// })

LyricsRouter
  .route('/:lyric_id')
  .all((req,res,next)=>{
    LyricsService.getById(
      req.app.get('db'),
      req.params.lyric_id
      )
  .then(lyrics => {
    if (!lyrics) {
      return res.status(404).json({
        error: { message: `Lyrics doesn't exist` }
      })
    }
    res.lyrics = lyrics // save lyric as lyric for later use
    next()
  })
  .catch(next)
  })
  .get((req, res, next) => {
        res.json({
          id: res.lyrics.id,
          title: xss(res.lyrics.title),
          genre: res.lyrics.genre, // sanitize title
          mood: res.lyrics.mood, // sanitize content
          artist: xss(res.lyrics.artist),
          lyrics: xss(res.lyrics.lyrics) 
        })
  })
  .delete((req, res, next) => {
    LyricsService.deleteLyrics(
          req.app.get('db'),
           req.params.lyric_id
         )
           .then(() => {
             res.status(204).end()
           })
         .catch(next)
  })

  // .delete((req, res) => {
  //   const { id } = req.params;

  //   const lyricIndex = lyricData.findIndex(li => li.id == id);

  //   if (lyricIndex === -1) {
  //     logger.error(`Lyrics with id ${id} not found.`);
  //     return res
  //       .status(404)
  //       .send('Not Found');
  //   }

  //   lyricData.splice(lyricIndex, 1);

  //   logger.info(`Lyrics with id ${id} deleted.`);
  //   res
  //     .status(204)
  //     .end();
  // })

module.exports = LyricsRouter
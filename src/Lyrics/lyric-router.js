const express = require('express')
const LyricService = require('./lyric-service')
const lyricRouter = express.Router()
const bodyParser = express.json()
const xss = require('xss')

const { v4: uuid } = require('uuid')

const logger = require('../logger')
const lyricData = require('../store')



lyricRouter
  .route('/')
  .get((req, res, next) => {
    LyricService.getAllLyrics(req.app.get('db'))
      .then(lyrics => {
        res.json(lyrics)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { title, genre, mood, artist, lyrics } = req.body;
    // if (!title) {
    //   logger.error(`title is required`);
    //   return res
    //     .status(400)
    //     .send('Please enter a title for your lyrics!');
    // }
    // if (!genre) {
    //   logger.error(`genre is required`);
    //   return res
    //     .status(400)
    //     .send('Please select a genre for your lyrics!');
    // }
    // if (!mood) {
    //   logger.error(`mood is required`);
    //   return res
    //     .status(400)
    //     .send('Please select a mood for your lyrics!');
    // }
    // if (!artist) {
    //   logger.error(`artist name is required`);
    //   return res
    //     .status(400)
    //     .send('Please provide an artist name for your lyrics!');
    // }
    // if (!lyrics) {
    //   logger.error(`lyrics is required`);
    //   return res
    //     .status(400)
    //     .send('Please provide Lyrics!');
    // }
    // // get an id
    // const id = uuid();

    // const newLyrics = {
    //   id,
    //   title,
    //   genre,
    //   mood,
    //   artist,
    //   lyrics,
    //   expanded: false
    // };

    const newLyrics = { title, genre, mood, artist, lyrics }
    for (const [key, value] of Object.entries(newLyrics)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    LyricService.insertLyrics(
      req.app.get('db'),
      newLyrics
    )
      .then(lyrics => {
        res
          .status(201)
          .location(`/lyrics/${lyrics.id}`)
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

lyricRouter
  .route('/:lyric_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    LyricService.getById(knexInstance, req.params.lyric_id)
      .then(lyric => {
        if (!lyric) {
          return res.status(404).json({
            error: { message: `Lyrics doesn't exist` }
          })
        }
        res.json({
          id: lyric.id,
          title: xss(lyric.title),
          genre: lyric.genre, // sanitize title
          mood: lyric.mood, // sanitize content
          artist: xss(lyric.artist),
          lyrics: xss(lyric.lyrics) 
        })
      })
      .catch(next)
  })


  .delete((req, res) => {
    const { id } = req.params;

    const lyricIndex = lyricData.findIndex(li => li.id == id);

    if (lyricIndex === -1) {
      logger.error(`Lyrics with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }

    lyricData.splice(lyricIndex, 1);

    logger.info(`Lyrics with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = lyricRouter
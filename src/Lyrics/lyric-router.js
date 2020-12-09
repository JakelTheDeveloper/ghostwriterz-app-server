const path = require('path')
const express = require('express')
const LyricsService = require('./lyric-service')
const LyricsRouter = express.Router()
const bodyParser = express.json()
const xss = require('xss')

const { v4: uuid } = require('uuid')

const logger = require('../logger')
const lyricData = require('../store')

const serializeLyrics = lyrics => ({
  id: lyrics.id,
  title: xss(lyrics.title),
  genre: lyrics.genre,
  mood: lyrics.mood,
  artist: lyrics.artist,
  lyrics: xss(lyrics.lyrics),
})




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
    const { title, lyrics, genre, mood, artist } = req.body;
    const newLyrics = { title, lyrics, genre, mood, artist }
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
          .json(serializeLyrics(lyrics))
      })
      .catch(next)
  })


LyricsRouter
  .route('/:lyric_id')
  .all((req, res, next) => {
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
        res.lyrics = lyrics
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      id: res.lyrics.id,
      title: xss(res.lyrics.title),
      genre: res.lyrics.genre,
      mood: res.lyrics.mood,
      artist: res.lyrics.artist,
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
  .patch(bodyParser, (req, res, next) => {
    const { title, genre, mood, artist, lyrics } = req.body
    const lyricsToUpdate = { title, genre, mood, artist, lyrics }

    if(title === ''||lyrics === ''||title === null||lyrics === null){
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'genre', 'mood', 'artist' or 'lyrics'`
        }
      })
    }
  
    const {lyric_id} = req.params;
    LyricsService.updateLyrics(
      req.app.get('db'),
      lyric_id,artist,
      lyricsToUpdate
    )
      .then(lyricsFromDb => {
        console.log(lyricsFromDb)
        res.status(201).json(lyricsFromDb[0])
      })
      .catch(next)
  })

module.exports = LyricsRouter
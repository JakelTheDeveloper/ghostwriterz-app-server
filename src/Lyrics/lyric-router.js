const express = require('express')
const LyricService = require('./lyric-service')
const lyricRouter = express.Router()
const bodyParser = express.json()

const { v4: uuid } = require('uuid')

const logger = require('../logger')
const lyricData = require('../store')



lyricRouter
  .route('/')
  .get((req, res, next) => {
    LyricService.getAllLyrics(req.app.get('db'))
    .then(lyrics =>{
      res.json(lyricData)
    })
    
  })
  .post(bodyParser, (req, res) => {
    const { title, rating, genre, mood, artist, lyrics } = req.body;
      if (!title) {
        logger.error(`title is required`);
        return res
          .status(400)
          .send('Invalid data');
      }
      if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
        logger.error(`Invalid rating '${rating}' supplied`)
        return res.status(400).send(`'rating' must be a number between 0 and 5`)
      }
      if (!genre) {
        logger.error(`Please select a genre for your lyrics`);
        return res
          .status(400)
          .send('Please select a genre for your lyrics');
      }
      if (!mood) {
        logger.error(`Please select a mood for your lyrics`);
        return res
          .status(400)
          .send('Please select a mood for your lyrics');
      }
      if (!artist) {
        logger.error(`Please provide an artist name for your lyrics`);
        return res
          .status(400)
          .send('Please provide an artist name for your lyrics');
      }
      if (!lyrics) {
        logger.error(`Please provide Lyrics`);
        return res
          .status(400)
          .send('Please provide Lyrics');
      }
      // get an id
      const id = uuid();
    
      const newLyrics = {
        id,
        title,
        rating,
        genre,
        mood,
        artist,
        lyrics,
        expanded:false
      };
    
      lyricData.push(newLyrics);
    
      logger.info(`Lyrics with id ${id} created`);
    
      res
        .status(201)
        .location(`http://localhost:8000/lyrics/${id}`)
        .json({id});
  })

  lyricRouter
  .route('/lyrics/:id')
  .get((req, res) => {
    const { id } = req.params;
    const lyric = lyricData.find(lyric => lyric.id == id);
  
    // make sure we found a card
    if (!lyric) {
      logger.error(`Lyrics with id ${id} not found.`);
      return res
        .status(404)
        .send('Lyrics Not Found');
    }
  
    res.json(lyric);
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
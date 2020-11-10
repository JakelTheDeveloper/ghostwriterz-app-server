require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston');
const { v4: uuid } = require('uuid');
const { NODE_ENV } = require('./config')

const app = express()

app.use(express.json());

const lyricData = [
  {
      id:1,
      title: "Hello",
      rating: 5,
      genre:"Rap",
      mood:"Happy",
      artist:"Foo",
      lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
      expanded:false
  },
  {
      id:2,
      title: "Bye",
      rating: 3,
      genre:"Soul",
      mood:"Sad",
      artist:"Bar",
      lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
      expanded:true
  },
  {
      id:3,
      title: "See You Again",
      rating: 2,
      genre:"Rock",
      mood:"Energetic",
      artist:"Lee",
      lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
      expanded:false
  },
]

// set up winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

//Set Up validate Token
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/', (req, res) => {
      res.send('Hello, world!')
     })

     app.get('/lyrics', (req, res) => {
      res
        .json(lyricData);
    });

    app.get('/lyrics/:id', (req, res) => {
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
    });

    app.post('/lyrics', (req, res) => {
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
    });

    app.delete('/lyrics/:id', (req, res) => {
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
    });

     app.use(function errorHandler(error, req, res, next) {
           let response
           if (NODE_ENV === 'production') {
             response = { error: { message: 'server error' } }
           } else {
             console.error(error)
             response = { message: error.message, error }
           }
           res.status(500).json(response)
         })

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

module.exports = app
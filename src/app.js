require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston');
const { NODE_ENV } = require('./config')

const app = express()

const lyrics = [
  {
      id:1,
      title: "Hello",
      genre:"Rap",
      mood:"Happy",
      artist:"Foo",
      lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
      expanded:false
  },
  {
      id:2,
      title: "Bye",
      genre:"Soul",
      mood:"Sad",
      artist:"Bar",
      lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
      expanded:true
  },
  {
      id:3,
      title: "See You Again",
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
        .json(lyrics);
    });

    app.get('/lyrics/:id', (req, res) => {
      const { id } = req.params;
      const lyric = lyrics.find(lyric => lyric.id == id);
    
      // make sure we found a card
      if (!lyric) {
        logger.error(`Lyrics with id ${id} not found.`);
        return res
          .status(404)
          .send('Lyrics Not Found');
      }
    
      res.json(lyric);
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
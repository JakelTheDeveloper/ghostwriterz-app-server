require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const lyricRouter = require('./Lyrics/lyric-router')
const knex = require('knex')
const LyricService = require('./lyric-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(LyricService.getAllArticles())

// knexInstance.from('lyric_data').select('*')
// .then(result =>{
//    console.log(result)
// })
// knexInstance.from('lyric_data')

// const qry = knexInstance
// .select('title','lyrics')
// .from('lyric_data')
// .where({artist:'Jupiter'})
// .first()
// .toQuery()
// .then(r=>{
//   console.log(r)
// })
// console.log(qry)

function searchByTitle(searchTerm) {
  knexInstance
  .select('title', 'genre', 'mood', 'artist','lyrics')
     .from('lyric_data')
    .where('title', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
     })
}

function paginateLyrics(page) {
  const lyricsPerPage = 2
  const offset = lyricsPerPage * (page - 1)
  knexInstance
  .select('title', 'genre', 'mood', 'artist','lyrics')
  .from('lyric_data')
    .limit(lyricsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

// paginateLyrics(1)

// searchByTitle('ow')



const app = express()

app.get('/', (req, res) => {
  res.send('Hello, world!')
 })


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

     
app.use(lyricRouter);



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
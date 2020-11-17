require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const lyricRouter = require('./Lyrics/lyric-router')
const logger = require('./logger')
const app=express().use('*', cors());

app.use(helmet())
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello, world!')
})


app.use('/api/lyrics', lyricRouter)

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
 


module.exports = app













// LyricService.getAllLyrics(knexInstance)
//   .then(lyrics => console.log(lyrics))
//   .then(() =>
//     LyricService.insertLyrics(knexInstance, {
//       title: "Hello",
//       genre: "Rap",
//       mood: "Happy",
//       artist: "Foo",
//       lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
//     })
//   )
//   .then(newLyric => {
//     console.log(newLyric)
//     return LyricService.updateLyrics(
//       knexInstance,
//       newLyric.id,
//       {
//         title: "Updated Title",
//       }
//     ).then(() => LyricService.getById(knexInstance, newLyric.id))
//   })
//   .then(lyric => {
//     console.log(lyric)
//     return LyricService.deleteLyrics(knexInstance, lyric.id)
//   })


// console.log(LyricService.getAllLyrics())

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

// function searchByTitle(searchTerm) {
//   knexInstance
//   .select('title', 'genre', 'mood', 'artist','lyrics')
//      .from('lyric_data')
//     .where('title', 'ILIKE', `%${searchTerm}%`)
//     .then(result => {
//       console.log(result)
//      })
// }

// function paginateLyrics(page) {
//   const lyricsPerPage = 2
//   const offset = lyricsPerPage * (page - 1)
//   knexInstance
//   .select('title', 'genre', 'mood', 'artist','lyrics')
//   .from('lyric_data')
//     .limit(lyricsPerPage)
//     .offset(offset)
//     .then(result => {
//       console.log(result)
//     })
// }
// paginateLyrics(1)
// searchByTitle('ow')

// use all the LyricService methods!!
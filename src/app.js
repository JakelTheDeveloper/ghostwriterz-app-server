require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const lyricRouter = require('./Lyrics/lyric-router')
const AuthRoute = require('./auth/auth-router')
const logger = require('./logger')
const usersRouter = require('./users/users-router')
const app=express().use('*', cors())

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'
app.use(morgan(morganOption))

app.use(helmet())


app.get('/', (req, res) => {
  res.send('Hello, world!')
})


app.use('/api/auth', AuthRoute)
app.use('/api/users', usersRouter)
app.use('/api/lyrics', lyricRouter)


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

module.exports = app
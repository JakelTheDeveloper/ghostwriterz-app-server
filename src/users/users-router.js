const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const errorService = require('../error-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  fullname: xss(user.fullname),
  username: xss(user.username),
  nickname: xss(user.nickname),
  date_created: user.date_created,
})

usersRouter
  .route('/') 
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { fullname, username, nickname, password, passwordConfirm } = req.body
    const newUser = { fullname, username, nickname, password }
    const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
    let hashedPassword;

    if (fullname === '' || fullname === null) {
      return res.status(400).json({ error: { message: `Missing 'Full Name' in request body` } })
    } else
      if (username === '' || username === null) {
        return res.status(400).json({ error: { message: `Missing 'Email' in request body` } })
      } else
        if (nickname === '' || nickname === null) {
          return res.status(400).json({ error: { message: `Missing 'UserName' in request body` } })
        } else
          if (password === '' || password === null) {
            return res.status(400).json({ error: { message: `Missing 'Password' in request body` } })
          } else
            if (password.length < 8 || password.length > 72) {
              return res.status(400).json({ error: { message: `Password must be between 8-72 characters long` } })
            } else
              if (password.startsWith(' ') || password.endsWith(' ')) {
                return res.status(400).json({ error: { message: `Password must have no spaces at beginning or end` } })
              } else
                if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
                  return res.status(400).json({ error: { message: 'Password must contain 1 upper case, lower case, number and special character' } })
                } else
                  if (password != passwordConfirm) {
                    return res.status(400).json({ error: { message: `Passwords must match!` } })
                  }
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      nickname
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: { message: `Username Already Taken!` } })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            newUser.fullname = fullname;
            newUser.username = username;
            newUser.nickname = nickname;
            newUser.password = hashedPassword;

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(serializeUser(user))
              })
          })
          .catch(next)
      })
  })

usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UsersService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { fullname, username, password, nickname } = req.body
    const userToUpdate = { fullname, username, password, nickname }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'fullname', 'username', 'password' or 'nickname'`
        }
      })

    UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter
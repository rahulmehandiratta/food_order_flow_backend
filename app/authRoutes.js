import JWT from 'express-jwt'
import express from 'express'
import UserController from './controllers/user'
import {secret} from '../config/settings'

const app = express.Router()

app.route('/ping')
  .get((req, res) => {
    res.send('pong')
  })

app.route('/login')
  .post(async (req, res) => {
    const {body} = req
    const response = await UserController.login(body)
    res.json(response)

  })

app.route('/user')
  .get(async (req, res) => {
    const response = await UserController.usersList()
    res.json(response)

  })
  .post(async (req, res) => {
    const {body} = req
    const response = await UserController.add(body)
    res.json(response)

  })

app
  .route('/user/:_id')
  .get(async (req, res) => {
    const {params: {_id}} = req
    const response = await UserController.profile(_id)
    res.json({...response})
  })
  .put(JWT({secret}), async (req, res) => {
    const {params: {_id}, body} = req
    body._id = _id
    const response = await UserController.update(body)
    res.json({...response})

  })
  .delete(JWT({secret}), async (req, res) => {
    const {params: {_id}} = req
    const data = await UserController.delete(_id)
    res.json({...data})
  })

export default app

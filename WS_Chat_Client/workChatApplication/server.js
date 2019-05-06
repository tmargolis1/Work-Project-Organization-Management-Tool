const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()
//server will accept POST request from client with username


const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:5d804c1c-f7cc-4f8b-a31d-bd201c076298',
  key: '373b8309-f95d-4802-9449-13261a294fcd:fai7bJiO0hZBFH1CkFhBaKc0yii0mWkYvbAAlFiA/pI=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

//error on statuscode
app.post('/users', (req, res) => {
    const { username } = req.body
    chatkit
      .createUser({
        id: username,
        name: username
      })
      .then(() => res.sendStatus(201))
      .catch(error => {
        if (error.error === 'services/chatkit/user_already_exists') {
          res.sendStatus(200)
        } else {
          res.status(error.status).json(error)
        }
      })
  })

  //look into real authentication
  app.post('/authenticate', (req, res) => {
      const authData = chatkit.authenticate({ userId: req.query.user_id })
      res.status(authData.status).send(authData.body)
    })


const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})

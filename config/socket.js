import {secret} from './settings';
import moment from 'moment'
import User from '../app/models/user'
import _ from 'lodash';
import UserController from "../app/controllers/user";

const JWT = require('jsonwebtoken');


const saveIsOffline = async (userId) => {
  console.log('is logut')
  await User.update({_id: userId}, {
    deviceToken: null,
  })
}


const socketObj = {
  runSocket: (io) => {
    io.on('connection', (socket) => {
      console.log('a user connected ', new Date())

      socket.on('authenticate', (data) => {
        if (data && data.userToken) {
          JWT.verify(data.userToken, secret, (err, decoded) => {
            if (err) {
              console.log(err)
              return
              // return callback(new Error('Tokea Authentication error'))
            }
            socket.userId = decoded._id
            socket.username = decoded.name
            socket.join(decoded._id)
            socketObj.postAuthenticate(socket, io)
          })
        }
      })

      socket.on('disconnect', function () {
        // console.log(socket.username + ' has disconnected from the chat.' + socket.id)
      })


      socket.on('leaveAuth', ({userId}) => {
        // console.log('===================lslsl', userId)
        if (userId) {
          socket.leave(userId);
        }
      })

      socket.on('new notification', (data) => {
        socket.emit('new notification', {
          userId: data.userId,

        });
      });

      /* socket.on('refresh kot', (data) => {
         socket.broadcast.emit('refresh kot', {
           data
         });
       });*/

    })
  },
  postAuthenticate: (socket, io) => {
    // console.log('authentication done on server ', socket.username)

    socket.on('join_chat_room', ({roomId}) => {
      /* console.log('==============================')
       console.log('join chat room', roomId, '+++++++++++++++++++')*/
      if (roomId) {
        socket.join(roomId)
      }
    })
    socket.on('leave_chat_room', ({roomId}) => {
      if (roomId) {
        // console.log('leave chat room', roomId)
        socket.leave(roomId)
      }
    })


    socket.on('on_logout', () => {
      // console.log('is logout', ' on_logout event is called ')
      //  socket.leave(socket.userId);
      saveIsOffline(socket.userId)
      socket.disconnect()
    })

  },
  runSocketForPingTest: (io) => {
    io.on('connection', (socket) => {
      // console.log('a user connected ', new Date())

      socket.on('disconnect', function () {
        console.log(socket.name + ' has disconnected from the chat.' + socket.id)
      })

    })
  },
}

export default socketObj

import validator from 'email-validator'
import jwt from 'jsonwebtoken'
import {TableFilterQuery} from 'sz-node-utils'
import User from '../models/user'

import {secret, errorObj, successObj} from '../../config/settings'

const exp = {
  add: (data) => {
    return new Promise((resolve) => {

      const {email, password, userType} = data

      if (!email || !password) {
        return resolve(
          {...errorObj, message: 'Please enter email and password'})
      }

      if (!validator.validate(email)) {
        return resolve({...errorObj, message: 'Invalid Email Address'})
      }

      const user = new User()
      user.email = email
      user.password = user.generateHash(password)

      if (userType) {
        user.userType = userType
      }

      user.save((err, doc) => {
        if (err) {
          console.error(err)
          return resolve({...errorObj, message: 'Error Saving User Details'})
        }
        resolve({...successObj, message: 'user added successfully', data: doc})
      })

    })
  },
  profile: (_id) => {
    return new Promise((resolve) => {
      User.findOne({_id})
        .exec((err, data) => {

          if (err) {
            console.error(err)
            return resolve({...errorObj, message: 'User not found'})
          }

          resolve({...successObj, data})
        })
    })
  },
  usersList: (data) => {
    return new Promise(async (resolve) => {
      const x = await TableFilterQuery(User, {...data})
      resolve(x)
    })
  },
  update: (data) => {
    return new Promise((resolve) => {
      User.findOne({_id: data._id})
        .exec((error, result) => {
          if (error || !result) return resolve({...errorObj, error})
          result.email = data.email
          result.password = result.generateHash(data.password)

          result.save((err, doc) => {
            if (err) return resolve({...errorObj, err})
            resolve({
              data: doc,
              message: 'User updated successfully',
              ...successObj,
            })
          })
        })

    })
  },
  delete: (_id) => {
    return new Promise((resolve) => {
      User.remove({_id})
        .exec((err, doc) => {
          if (err || !doc) return resolve({...errorObj, err})
          resolve({...successObj, message: 'User deleted successfully'})
        })
    })
  },
  removeAll: () => {
    return new Promise((resolve) => {
      User.remove({})
        .then((err) => {

          if (!err) {
            return resolve({...errorObj, err})
          }

          resolve({...successObj, data: []})

        })

    })
  },
  getTokenFields: (result) => {
    return new Promise((resolve) => {
      let tokenObj = {
        _id: result._id,
        name: result.name,
        email: result.email,
        userType: result.userType,
      }
      resolve(tokenObj)
    })
  },

  login: data => (new Promise((resolve) => {
    let {email, password} = data;
    email = email.toLowerCase()
    const error = 'wrong email or password'

    User.findOne({email})
      .exec(function (err, user) {

        if (!user) {
          return resolve({message: 'User not found.', ...errorObj})
        }
        if (!user.validPassword(password)) {
          return resolve({...errorObj, message: 'Invalid password'})
        }
        if (user.block) {
          return resolve({
            ...errorObj,
            message: 'Sorry, you can not login, Please contact to administrator'
          })
        } else {
          exp.getTokenFields(user)
            .then((resp) => {
              const JWTToken = jwt.sign(
                {...resp},
                secret,
                {
                  expiresIn: '365h',
                })
              return resolve({
                ...successObj,
                token: JWTToken,
                user: resp,
                message: 'Login successfully.'
              })
            })
        }
      })

  })),

}

export default exp

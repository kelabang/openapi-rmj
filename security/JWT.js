/**
 * JWT
 */

const Debug = require('debug')
const {createResponseHandler, JWT} = require('./../helper/index')
const _JWT = JWT
const pipeline = require('./../lib/promise/pipeline')
const Token = require('./../models/Token')
const name = 'security:JWT'
debug = Debug('rumaji:'+name)

module.exports = function JWT(req, res, next) {

  debug('incoming request')

  const {headers} = req
  const {authorization} = headers
  const user_agent = headers['user-agent']
  debug('is authorization exist ? ', authorization)
  if(!authorization) return unAuthorize()
  const token = (authorization.indexOf('Bearer ') > -1)?
    authorization.replace('Bearer ', ''):
    authorization

  // debug('headers', headers)
  // debug('authorization', authorization)
  // debug('token', token)

  function isJWT () {
    // check if passed token is JWT
    debug('is token jwt ?', arguments)
    return new Promise((resolve, reject) => {
      try{
        const payload = _JWT.decode(token)
        if(!payload) throw new Error('cannot decode token')
        debug('yes,')
        debug('token payload ', payload)
        resolve(payload)
      }
      catch(err){
        debug('no,')
        debug('cannot decode token')
        // reject(err)
        // console.log(next)
        // next(err)
        unAuthorize()
      }
    })

  }

  function modelQuery (payload) {
    debug('fetching token', arguments)
    const {id, iat} = payload
    return new Token({
      user_id: payload.id,
      iat: payload.iat
    })
    .fetch()
  }

  function isValid (datatoken) {
    debug('is jwt valid ?')
    if(!datatoken) throw new Error('token not found')
    const certificate_access_token = datatoken.get('certificate_access_token')
    const private_access_token = datatoken.get('private_access_token')
    debug('trying verify token')
    return new Promise((res, rej) => {
      debug('certificate_access_token')
      _JWT.verify(token, certificate_access_token, function (err, data) {
        debug('verify token done')
        if(err) {
          debug('verify token failed', err)
          return rej(new Error('cannot verify token'))
        }
        debug('verify token success')
        debug('payload', data)
        return res(data)
      })
    })
    .catch((err) => {
      debug('catch in promise')
      console.error(err)
    })
  }

  function postResponseHandler (data) {
    debug('post-response handler')
    const {id} = data
    if(!id) return unAuthorize()
    if(!req.body) req.body = {}
    req.body.user_id = id // set user id to body
    next()
  }

  // TODO: implement decodeToken and getTokenScopes
  //const token = decodeToken(req)
  //if (token) {
  //  const scopes = getTokenScopes(token)
  //  next(req.verifyScopes(scopes))
  //} else {

  //}

  function unAuthorize () {
    const error = new Error('Unauthorized')
    error.status = error.statusCode = 401
    next(error)
  }

  const tasks = [
    isJWT,
    modelQuery,
    isValid,
    postResponseHandler
  ]

  return pipeline(tasks)

}

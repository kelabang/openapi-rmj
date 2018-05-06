/**
 * Authentication with facebook
 *
 * POST: /v2/auth/facebook
 * 
 * body:
 *   accessToken {string}
 *   userID {string}
 *   
 */

const Debug = require('debug')
const _ =  require('lodash')
const moment = require('moment')
var {FB, FacebookApiException} = require('fb');
const User = require('./../models/User')
const UserSocial = require('./../models/User').UserSocial
const Token = require('./../models/Token')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller, JWT} = require('./../helper/index')

let debug

exports.handler = function authFacebook(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function facebookConnect () {
		debug('authenticating user to facebook')
		const {accessToken, userID} = req.body
		return new Promise((resolve, reject) => {
			FB.api(
				'me', 
				{ fields: ['id', 'name', 'email'], access_token: accessToken }, 
				function (res) {
				    debug('response from facebook /me', res)
				    const {id, name, error} = res
				    if(error) 
				    	debug('Third-party error')
				    if(!id) return reject(res)
				    debug('user authenticated')
				    resolve(res)
				}
			)
		})
	}

	function modelQuery (facebook) {
		try {
			debug('check if user already registered')
			const {id, name, email} = facebook
			return UserSocial.getUserByFacebookId(id)
			.then(user => {
				console.log('return from get facebook id', user)
				if(!user) {
					debug('not registered yet')
					facebook.thirdparty = true
					facebook.thirdpartyname = 'facebook'
					return facebook
				}
				debug('already registered')
				debug('try to logging in')
				const payload = {
					...user.attributes,
					created: undefined,
					updated: undefined,
					deleted: undefined,
					username: undefined,
					email: undefined,
					password: undefined,
					firstname: undefined,
					lastname: undefined,
					phone: undefined,
					status: undefined,
					activation: undefined,
					iat: moment().unix()
				}
				/*
					{
					  "id": 1,
					  "created": "2018-02-03 08:00:25",
					  "deleted": null,
					  "updated": null,
					  "username": "admin",
					  "email": "imam.tauhid.dar@gmail.com",
					  "password": "rumaji",
					  "firstname": null,
					  "lastname": null,
					  "phone": null,
					  "status": 0,
					  "activation": 0,
					  "iat": 1517762936,
					  "exp": 1517766536,
					  "iss": "rumaji.com"
					}
				 */
				return JWT.genKey()
					.then(key => {
						return {
							...key,
							payload
						}
					})
			})
			.then(data => {
				const {payload, serviceKey} = data
				const params = JWT.genParams()
				return JWT.sign(payload, serviceKey, params)
					.then(token => {
						debug('token release', token)
						return {
							...data,
							token
						}
					})
			})
			.then(data => {
				const user_agent = req.headers['user-agent']
				const {payload, serviceKey, certificate, token} = data
				const {id, iat} = payload
				debug('data after all', data)
				debug('data after user_agent', user_agent)
				const toSave = {
					user_id: id,
					certificate_access_token: certificate,
					private_access_token: serviceKey,
					user_agent: user_agent,
					iat: iat,
				}
				return new Token(toSave)
					.save()
					.then(data => data.set('token', token))
			})
			.catch(err => {
				debug('catch in promise')
				debug('authentication user failed')
				console.error(err)
				return err
			})	
		}
		catch(err) {
			debug('authentication user failed')
			console.error(err)
			return false
		}
	}

	function preResponseHandler (predata) {
		debug('pre-response handler')
		let code = 200
		let {attributes} = predata
		debug('coba', attributes)
		if(!attributes) attributes = {}
		let {user_id, token} = attributes
		let data = {
			id:user_id, token
		}
		let toResponse = {name, code, data}
		if(Object.keys(predata).length < 1) _.assign(toResponse, {
			code: 400, data: undefined
		})
		if(typeof predata == 'boolean' && !predata) _.assign(toResponse, {
			code: 503, data: undefined
		})
		if(typeof predata == 'object' && (predata.errno || predata.error || Object.keys(predata).length == 0)) _.assign(toResponse, {
			code: 400, data: undefined
		})
		return toResponse
	}

	function postResponseHandler(data) {
		debug('post-response handler')
		res.send(data.code,data)
		next()
	}

	const tasks = [
		facebookConnect,
		modelQuery,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)

}

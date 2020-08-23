/**
 * Authentication with password
 *
 * POST: /v2/auth/login
 * 
 * body:
 *   client_id {string}
 *   grant_type {string}
 *   user {string}
 *   password {string}
 *   
 */

 const Debug = require('debug')
 const _ =  require('lodash')
 const moment = require('moment')
 const User = require('./../models/User')
 const Token = require('./../models/Token')
 const pipeline = require('./../lib/promise/pipeline')
 const {createResponseHandler, getNameCaller, JWT, isEmail} = require('./../helper/index')

let debug

exports.handler = function authPassword(req, res, next) {
	console.log('authPassword')
	const name = getNameCaller() 
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('check if user already registered')
			const {user, password} = req.body
			const resEmail = isEmail(user)
			return User.query(function (qb) {
				if(!resEmail) return qb.where('username', '=', user)
				return qb.where('email', '=', user)
			})
			.fetch()
			.then(user => {
				if(!user) {
					debug('not registered yet')
					return user
				}
				debug('user registered')
				debug('result of user ', user)
				const _hash = user.get('password')
				return user.comparePassword(password, _hash)
					.then(isSame => {
						debug('isSame ', isSame)
						if(!isSame) throw new Error('incorrect password')
						return user
					})
			})
			.then(user => {
				debug('try to loggin')
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
					.then(data => {
						data.set('token', token)
						data.set('private_access_token', '')
						data.set('certificate_access_token', '')
						debug('token', data)
						return data
					})
			})
			.catch(err => {
				debug('catch in promise')
				debug('authentication user failed')
				console.error(err)
				return {
					err: err
				}
			})
		}
		catch(err) {
			debug('check user is failed')
			console.error(err)
			return false
		}
	}

	function preResponseHandler (data) {
		debug('pre-response handler', data)
		let code = 200
		let toResponse = {name, code, data}
		if(typeof data == 'boolean' && !data) _.assign(toResponse, {
			code: 503, data: undefined
		})
		if(typeof data == 'object' && data.errno) _.assign(toResponse, {
			code: 400, data: undefined
		})
		if(typeof data == 'object' && data.err) _.assign(toResponse, {
			code: 401, data: undefined, message: data.err
		})
		return toResponse
	}

	function postResponseHandler(data) {
		debug('post-response handler')
		res.send(data.code,data)
		next()
	}

	const tasks = [
		modelQuery,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)

}

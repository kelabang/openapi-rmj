/**
 * Register new user
 *
 * POST: /v2/user/registration
 * 
 * body:
 *   username {string}
 *   email {string}
 *   password {string}
 *   ref_type {int64}
 *   ref_id {string}
 *   
 */

 const Debug = require('debug')
 const _ =  require('lodash')
 const User = require('./../models/User')
 const pipeline = require('./../lib/promise/pipeline')
 const {createResponseHandler, getNameCaller} = require('./../helper/index')

 let debug

exports.handler = function registerUser(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('user registering')
			debug('incoming body ', req.body)
			const {username, email, password, ref_id, ref_type} = req.body	
			return User.registeringUser({username, email, password, ref_id, ref_type})
			.catch(err => {
				debug('catch in promise')
				debug('user register failed')
				console.error(err)
				return err
			})
		}
		catch(err) {
			debug('user register failed')
			console.error(err)
			return false
		}
	}

	function preResponseHandler (data) {
		debug('pre-response handler')

		let code = 201
		let toResponse = {name, code, data}
		if(typeof data == 'boolean' && !data) _.assign(toResponse, {
			code: 503, data: undefined
		})
		if(typeof data == 'object' && (data.errno || Object.keys(data).length == 0)) _.assign(toResponse, {
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
		modelQuery,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)

}

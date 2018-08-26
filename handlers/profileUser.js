/**
 * Profile user
 *
 * GET: /v2/profile/{username}
 * 
 * path:
 *   username {string} Username of user to return.
 *   
 */
const Debug = require('debug')
const User = require('./../models/User')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function profileUser(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)
	function modelQuery () {
		try{
			debug('profile user fetching')
			const {
				username
			} = req.params

			return User
				.getProfileByUsername(username)
		}
		catch(err){
			console.error(err)
			debug('profile user fetch failed')
		}
	}

	function preResponseHandler (data) {
		debug('pre-response handler')
		let code = 200
		if(typeof data == 'boolean' && !data) code = 503
		return {
			code,
			data,
			name
		}
	}

	function postResponseHandler (data) {
		debug('post-response handler')
		res.send(data.code, data)
		next()
	}

	const tasks = [
		modelQuery,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)
}

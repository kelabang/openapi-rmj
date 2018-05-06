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
const Profile = require('./../models/Profile')
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
			return Profile
				.query(function (qb) {
					qb.innerJoin('users', 'profiles.user_id', 'users.id')
					qb.where('users.username', username)
					qb.limit(1)
				})
				.fetch({
					withRelated:[
						{"user": (qb) => {
							qb.column('username', 'id')
						}}
					]
				})
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

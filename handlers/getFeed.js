/**
 * Get feed to timeline
 *
 * GET: /v2/feed
 * 
 */

const Debug = require('debug')
const Feed = require('./../models/Feed')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function getFeed(req, res, next) {
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('feed fetching')
			return Feed
				.fetchAll({
					withRelated: ['user']
				}).then(function (feeds) {
					return feeds.map(function (feed) {
						// console.log('feed : ', feed.user())
						feed.set('user', feed.related('user'))
						return feed
					})
				})

		}
		catch(err) {
			debug('feed fetch failed')
			console.error(err)
			return false
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

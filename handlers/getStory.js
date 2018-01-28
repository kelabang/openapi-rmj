/**
 * Get story from collection
 *
 * GET: /v2/story
 * 
 */
const Debug = require('debug')
const Story = require('./../models/Story')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function getStory(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('story fetching')
			return Story
				.fetchAll()
		}
		catch(err) {
			debug('story fetch failed')
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

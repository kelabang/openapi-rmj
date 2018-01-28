/**
 * Add a new story to the collection
 *
 * POST: /v2/story
 * 
 * body:
 *   title {string}
 *   content {string}
 *   
 */
const Debug = require('debug')
const Story = require('./../models/Story')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function addStory(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('story creating')
			const {title, content} = req.body
			return new Story({
				title,
				content
			}).save()
		}
		catch(err) {
			debug('story create failed')
			console.error(err)
			return false
		}
	}

	function preResponseHandler (data) {
		debug('pre-response handler')
		let code = 201
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

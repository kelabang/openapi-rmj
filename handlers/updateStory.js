/**
 * Update story from collection
 *
 * PUT: /v2/story/{storyId}
 * 
 * path:
 *   storyId {int64} ID of story to return.
 *   
 * body:
 *   title {string}
 *   content {string}
 *   
 */

const Debug = require('debug')
const moment = require('moment')
const Story = require('./../models/Story')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function updateStory(req, res, next) {
	
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('story updating')
			const {storyId} = req.params
			const {title, content} = req.body
			return new Story({
				id: storyId,
				title,
				content,
				updated: moment().format('YYYY-MM-DD HH:mm:ss')
			}).save()
		}
		catch(err) {
			debug('story update failed')
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
			name
		}
	}

	function postResponseHandler(data) {
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

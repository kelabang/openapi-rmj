/**
 * Draft story
 *
 * POST: /v2/story/{storyId}/draft
 * 
 * path:
 *   storyId {int64} ID of story to return.
 *   
 */

const Debug = require('debug')
const moment = require('moment')
const Story = require('./../models/Story')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function postDraftStory(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('story drafting')
			const {storyId} = req.params
			const {title, content} = req.body
			return new Story({
				id: storyId,
				status: 'draft',
				updated: moment().format('YYYY-MM-DD HH:mm:ss')
			}).save()
		}
		catch(err) {
			debug('story draft failed')
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

/**
 * Add a new comment to feed
 *
 * POST: /v2/feed/{feedId}/comment
 * 
 * path:
 *   feedId {number} Id of feed.
 *   
 * body:
 *   content {string}
 *   type {int64}
 *   
 */

const Debug = require('debug')
const _ = require('lodash')

const Feed = require('./../models/Feed')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function addCommentOnFeed(req, res, next) {
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			const {feedId} = req.params
			const feed_id = feedId
			const {user_id} = req.body
			const {type, content} = req.body
			return new Feed({
				type,
				content,
				user_id,
				feed_id
			}).save()
			.catch(err => {
				debug('catch in promise')
				debug('feed create failed')
				return err
			})
		}
		catch(err) {
			debug('feed create failed')
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
		if(typeof data == 'object' && data.errno) _.assign(toResponse, {
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

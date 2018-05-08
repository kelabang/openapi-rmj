/**
 * Get feed to timeline
 *
 * GET: /v2/feed
 * 
 * query:
 *   id {string} Feed id flag.
 *   mode {string} Feed flow if next/prev flag.
 *   
 */

const Debug = require('debug')
const Feeds = require('./../models/Feed').collection
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function getFeed(req, res, next) {
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('feed fetching')
			const {
				id,
				mode
			} = req.query

			const limit = 15

			let fn = '';
			switch (mode) {
				case 'next':
					fn = 'feedMoreNext';
				break;
				case 'prev':
					fn = 'feedMorePrev';
				break;
				default:
					fn = 'feed';
			}
			return Feeds[fn]({id, limit})
				.then(function (feeds) {
					return feeds.map(function (feed) {
						feed.set('user', feed.related('user'))
						feed.set('comments', feed.related('comments'))
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

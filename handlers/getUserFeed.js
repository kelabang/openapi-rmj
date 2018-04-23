/**
 * Feed of user
 *
 * GET: /v2/{username}/feed
 * 
 * path:
 *   username {string} username of feed owner.
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

exports.handler = function getUserFeed(req, res, next) {
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery() {
		try{
			debug('feed user fetching ')
			const {
				id,
				mode,
			} = req.query
			
			const {
				username
			} = req.params
			const limit = 15

			let fn = '';
			switch (mode) {
				case 'next':
					fn = 'feeduserMoreNext';
					break;
				case 'prev':
					fn = 'feeduserMorePrev';
					break;
				default:
					fn = 'feeduser';
			}
			return Feeds[fn]({id, limit, username})
				.then(function (feeds) {
					return feeds.map(function (feed) {
						feed.set('user', feed.related('user'))
						return feed
					})
				})
		}
		catch (err) {
			debug ('feed user fetch failed')
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

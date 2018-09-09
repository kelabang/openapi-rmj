/**
 * Feed of book
 *
 * GET: /v2/book/{isbn}/feed
 * 
 * path:
 *   isbn {string} isbn of book.
 *   
 * query:
 *   id {string} Feed id flag.
 *   mode {string} Feed flow if next/prev flag.
 *   
 */

 const Debug = require('debug')
 const Books = require('./../models/Book').collection
 const pipeline = require('./../lib/promise/pipeline')
 const {createResponseHandler, getNameCaller} = require('./../helper/index')

 let debug

exports.handler = function getBookFeed(req, res, next) {
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('feed fetching')
			const {
				id,
				mode
			} = req.query
			const {
				isbn
			} = req.params
			const limit = 15

			let fn = '';
			switch (mode) {
				case 'next':
					fn = 'feedbookMoreNext';
					break;
				case 'prev':
					fn = 'feedbookMorePrev';
					break;
				default:
					fn = 'feedbook';
			}
			return Books[fn]({ id, limit, isbn })
				.then(function (books) {
					return books.map(function (book) {
						return book
					})
				})

		}
		catch (err) {
			debug('feed fetch failed')
			console.error(err)
			return false
		}
	}

	function preResponseHandler (data) {
		debug('pre-response handler')
		let code = 200
		if (typeof data == 'boolean' && !data) code = 503
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

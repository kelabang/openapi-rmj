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
 const Feeds = require('./../models/Feed').collection
 const pipeline = require('./../lib/promise/pipeline')
 const {createResponseHandler, getNameCaller} = require('./../helper/index')

 let debug

exports.handler = function getBookFeed(req, res, next) {
	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {}
	function preResponseHandler () {}
	function postResponseHandler () {}

	const tasks = [
		modelQuery,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)
}

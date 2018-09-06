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
const extract = require('mention-hashtag')

const Feed = require('./../models/Feed')
const User = require('./../models/User').collection
const Book = require('./../models/Book').collection
const TagUsersFeeds = require('./../models/Tag').TagUsersFeeds
const TagBooksFeeds = require('./../models/Tag').TagBooksFeeds
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
			.then(data => {
				const extracted = extract(content, {unique: true, type: 'all'}) 
				let {
					mentions,
					hashtags
				} = extracted
				mentions = mentions.map(item => item.replace('@', ''))
				if(mentions.length < 1) return data
				const userp = User
					.checkValidUsernames(mentions)
					.then(filtered => {
						let toAdd = []
						if (filtered.length < 1) return data
						filtered.map(item => {
							toAdd.push({
								feed_id: data.get('id'),
								user_id: item.id
							})
						})
						return TagUsersFeeds
							.forge(toAdd)
							.invokeThen('save')
							.then(resp => data)
					})
				const bookp = Book
					.checkValidISBN(mentions)
					.then(filtered => {
						let toAdd = []
						if (filtered.length < 1) return data
						filtered.map(item => {
							toAdd.push({
								feed_id: data.get('id'),
								book_id: item.id
							})
						})
						return TagBooksFeeds
							.forge(toAdd)
							.invokeThen('save')
							.then(resp => data)
					})
				Promise.all([
					userp,
					bookp
				]).then(([userresult, bookresult]) => {
					return []
				})
				
			})
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

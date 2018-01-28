/**
 * Find story
 *
 * GET: /v2/story/find
 * 
 * query:
 *   status {string} The status of story to return.
 *   title {string} The title of story to return.
 *   tags {string} The tags of story to return.
 *   
 */

 const Debug = require('debug')
 const Story = require('./../models/Story')
 const Stories = require('./../models/Stories')
 const pipeline = require('./../lib/promise/pipeline')
 const {createResponseHandler, getNameCaller} = require('./../helper/index')

 let debug

exports.handler = function findStory(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function modelQuery () {
		try {
			debug('story finding')
			const {title, tags, status} = req.query

			const query = {}
			if(title) query['title'] = title
			if(tags) query['tags'] = tags
			if(status) query['status'] = status

			return Stories.query(function (qb) {
				Object.keys(query).reduce((acc, curr) => {
					if(!acc) {
						return qb.where(curr, 'LIKE', query[curr])
					}
					return acc.andWhere(curr, 'LIKE', query[curr])
				}, null)
			}).fetch()
		}
		catch(err) {
			debug('story find failed')
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

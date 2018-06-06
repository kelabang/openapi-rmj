/**
 * Get link to upload
 *
 * GET: /v2/video/auth
 * 
 * query:
 *   size {string} Size of file.
 *   mime {string} Mime type of file.
 *   
 */
const Debug = require('debug')
const _ = require('lodash')

const JWP = require('./../helper/JWP')
const pipeline = require('./../lib/promise/pipeline')
const {createResponseHandler, getNameCaller} = require('./../helper/index')

let debug

exports.handler = function createVideoUpload(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function generateLink () {
		return new Promise (function (resolve, reject) {
			const {size, mime} = req.params
			const options = {size, mime}
			JWP.generateVideoLinkUpload(options, function (err, data) {
				if(err) return reject(err)
				let {query, fullpath} = data
				return resolve({url_upload: fullpath, details: query})
			})

		})
	}

	function preResponseHandler (data) {
		debug('pre-response handler')
		console.log('data', data)
		let code = 200
		let toResponse = {name, code, data}
		if(typeof data == 'boolean' && !data) _.assign(toResponse, {
			code: 503, data: undefined
		})
		if(typeof data == 'object' && data.errno) _.assign(toResponse, {
			code: 400, data: undefined
		})
		return toResponse
	}

	function postResponseHandler (data) {
		debug('post-response handler')
		res.send(data.code, data)
		next()
	}

	const tasks = [
		generateLink,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)

}

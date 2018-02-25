/**
 * Subscribe new email
 *
 * POST: /v2/user/subscribe
 * 
 * body:
 *   email {string}
 *   
 */

 const Debug = require('debug')
 const _ = require('lodash')

 // const Story = require('./../models/Story')
 const pipeline = require('./../lib/promise/pipeline')
 const {createResponseHandler, getNameCaller, MailChimp} = require('./../helper/index')

 let debug

exports.handler = function subscribeEmail(req, res, next) {

	const name = getNameCaller()
	debug = Debug('rumaji:'+name)

	function tellMailChimp () {
		debug('tell mail chimp')
		const {email} = req.body
		MailChimp(email)
		return Promise.resolve({success: true})
	}

	function preResponseHandler (data) {
		debug('pre-response handler')
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

	function postResponseHandler(data) {
		debug('post-response handler')
		res.send(data.code,data)
		next()
	}

	const tasks = [
		// modelQuery,
		tellMailChimp,
		preResponseHandler,
		createResponseHandler(name, postResponseHandler)
	]

	return pipeline(tasks)

}

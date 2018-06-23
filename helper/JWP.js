/*
* @Author: Imam
* @Date:   2018-06-03 13:09:09
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-11 02:43:36
*/
const debug = require('debug')('rumaji:JWP')
const request = require('request')
const jwPlatform = require('jwplatform-api')
const moment = require('moment')
const urlencode = require('urlencode')

const KEY = 'fkND90tj'
const SECRET = 'AQ4XaXzkT6ZFV1LB7N1DHaA4'

const api = new jwPlatform({
	key: KEY,
	secret: SECRET
})

function getVideoByKey(key) {
	debug('getVideoByKey')
	return new Promise(function (res, rej) {
		return api.get('v1/videos/show', {video_key: key}, function (err, result) {
			if(err) return rej(err)
			return res(result)
		})	
	})
	
}
function _responseSingle (data, cb) {
	debug('_responseSingle')
	const {
		link: {
			path,
			query: {
				token, key
			},
			protocol,
			address
		}
	} = data
	const query = {
		protocol,
		address,
		path,
		api_format: 'json',
		key: key,
		token: token
	}
	const apiUpload = protocol+'://'+address+path+'?api_format=json&key='+key+'&token='+token
	return cb(null, {
		query,
		fullpath: apiUpload
	})
}
function _responseS3 (data, cb) {
	debug('_responseS3')
	console.log('_responseS3 data ', data)

	const {
		media: {
			type, key
		},
		link: {
			path,
			query: {
				AWSAccessKeyId,
				Expires,
				Signature
			},
			protocol,
			address
		},
		rate_limit: {reset, limit, remaining}
	} = data
	let query = {
		protocol,
		address,
		path,
		api_format: 'json',
		key: key,
		token: null,
		AWSAccessKeyId,
		Expires,
		Signature,
		method: 's3'
	}
	const apiUpload = protocol+'://'+address+path+'?AWSAccessKeyId='+AWSAccessKeyId+'&Expires='+Expires+'&Signature='+urlencode(Signature)
	debug('signature generated ', apiUpload)
	return cb(null, {
		query,
		fullpath: apiUpload
	})
}
function generateVideoLinkUpload (options, cb) {
	debug('generateVideoLinkUpload')
	const {
		mime,
		size,
		method,
		tags
	} = options
	const body = {
		// title: "small.mp4",
		title: "rumaji_"+moment().format('YYYY-MM-DD_HH:mm:ss'),
		// upload_method:"single",
		size
	}
	if(method) body.upload_method = method
	if(!method) body.title = "rumaji_"+moment().format('YYYY-MM-DD_HH:mm:ss')
	if(method == 's3') body.upload_content_type = mime
	debug('body to send', body)
	debug('mime to send', mime)
	debug('method of body', method)
	return api.post('v1/videos/create', body, null, function (err, data) {
		if(err) return cb(err)
		console.log('videos data', data)
		switch (method) {
			case 's3':
				return _responseS3(data, cb)
			break
			default: 
				return _responseSingle(data, cb)
		}
		
	})
}

module.exports = {
	generateVideoLinkUpload,
	getVideoByKey
}
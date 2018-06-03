/*
* @Author: Imam
* @Date:   2018-06-03 13:09:09
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-03 13:36:09
*/
const debug = require('debug')('rumaji:JWP')
const request = require('request')
const jwPlatform = require('jwplatform-api')

const KEY = 'fkND90tj'
const SECRET = 'AQ4XaXzkT6ZFV1LB7N1DHaA4'

const api = new jwPlatform({
	key: KEY,
	secret: SECRET
})


function generateVideoLinkUpload (cb) {
	debug('generateVideoLinkUpload')
	const body = {}
	api.post('v1/videos/create', body, null, function (err, data) {
		if(err) return cb(err)
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
		const apiUpload = protocol+'://'+address+path+'?api_format=json&key='+key+'&token='+token
		return cb(null, apiUpload)
	})
}

module.exports = {
	generateVideoLinkUpload
}
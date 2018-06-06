/*
* @Author: Imam
* @Date:   2018-06-03 13:09:09
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-05 23:35:00
*/
const debug = require('debug')('rumaji:JWP')
const request = require('request')
const jwPlatform = require('jwplatform-api')
const moment = require('moment')

const KEY = 'fkND90tj'
const SECRET = 'AQ4XaXzkT6ZFV1LB7N1DHaA4'

const api = new jwPlatform({
	key: KEY,
	secret: SECRET
})


function generateVideoLinkUpload (options, cb) {
	debug('generateVideoLinkUpload')
	const {
		mime,
		size
	} = options
	const body = {
		title: "rumaji_"+moment().format('YYYY-MM-DD_HH:mm:ss'),
		upload_method:"single",
		size
	}
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
	})
}

module.exports = {
	generateVideoLinkUpload
}
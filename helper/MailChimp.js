/*
* @Author: Imam
* @Date:   2018-02-25 15:14:09
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-26 01:48:23
*/
const debug = require('debug')('rumaji:MailChimp')
const request = require('request')
// const mailchimp = require('mailchimp-v3')
const crypto = require('crypto') 
const {encode} = require('./base64')

var USER = 'ruru18'
var APIKEY = '99860d3d9b5033bb430f53cd8762e116-us17'
var DOMAIN = 'https://us17.api.mailchimp.com/3.0' 
var LISTS_ID = '38824e7830'
// mailchimp.setApiKey(APIKEY);

function requestLayer (method, _url, body = null) {
	debug('request to mailchimp')

	const url = DOMAIN+_url

	const options = {}
	options['headers'] = {
		'Authorization': 'Basic '+encode(USER+':'+APIKEY)
	}

	let opts = {}

	opts['url'] = url
	opts['method'] = method
	if(body) {
		opts['body'] = body
		opts['json'] = true
	}
	if(options.headers) opts.headers = options.headers
	debug('configuration to mailchimp request ', opts)
	return new Promise((res, rej) => {
		request(
			opts, 
			function (err, response, body) {
				if(err) {
					return rej(err)
				}
				res({response,body})
			})
	})

}

module.exports = function (email) {

	// check if email exist
	const hash = crypto.createHash('md5').update(email).digest('hex');
	debug('hash = ', hash)
	return requestLayer('GET', '/lists/'+LISTS_ID+'/members/'+hash)
		.then(({body, response}) => {
			if(response.statusCode == 200) {
				debug('email seems like already subscribed')
				return null
			}
			debug('email not subscribe yet')
			debug('tell mailchimp to subscibe this email')
			return requestLayer('POST', '/lists/'+LISTS_ID+'/members', {
				email_address: email,
				status: "subscribed",
			})
			.then(({body, response}) => {
				debug('mailchimp said done')
				return body
			})
		})
		.catch(err => {
			debug('something wrong with mailchimp')
			throw err
		})

} 
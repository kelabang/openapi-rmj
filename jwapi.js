/*
* @Author: Imam
* @Date:   2018-06-03 00:00:23
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-03 13:36:17
*/
const jwPlatform = require('jwplatform-api')
const fs = require('fs')
const request = require('request')

const api = new jwPlatform({
	key: 'fkND90tj',
	secret: 'AQ4XaXzkT6ZFV1LB7N1DHaA4'
})

const body = {}

const path = __dirname+'/assets/1.mkv'

api.post('v1/videos/create', body, null, function (err, data) {

	console.log('berikut isi data', data)
	const {
		link: {
			path,
			query:{
				token, key
			},     
			protocol,
			address
		}
	} = data
	const readStream = fs.createReadStream(path)
	const apiUpload = protocol+'://'+address+path+'?api_format=json&key='+key+'&token='+token
	console.log('apiUpload : '+ apiUpload) 
		const form_data = {
			file: path 
		}
		request.post(
			{
				url: apiUpload,
				formData: form_data
			},
			function cb (err, httpResponse, data) {
				if(err) return console.error(err)
				console.log('Upload success')
			}
		)	
})
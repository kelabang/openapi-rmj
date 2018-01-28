/*
* @Author: d4r
* @Date:   2018-01-13 22:22:39
* @Last Modified by:   d4r
* @Last Modified time: 2018-01-28 17:16:55
*/
'use strict'

const resolve = require('path').resolve
const debug = require('debug')('rumaji')
const restify = require('restify')
const swaggerRoutes = require('swagger-routes')

const env = 'dev'
const config = require('config-yml')[env]

const docloader = require('./docloader')

const server = restify.createServer()
server.use(restify.plugins.bodyParser()) // to read request body params
server.use(restify.plugins.queryParser()) // to read request query params
const docpath = 'api.yaml'

docloader(resolve(docpath))
	.then(docinfo => {
		global.swaggermaps = docinfo.maps // set maps to global, for response data later
		swaggerRoutes(server,{
			api: resolve(docpath),
			maintainHeaders: true
		})
		server.listen(config.port, () => {
			debug('%s listening at %s', server.name, server.url)
		})
	})

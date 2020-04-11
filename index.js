/*
* @Author: d4r
* @Date:   2018-01-13 22:22:39
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-24 01:21:23
*/
'use strict'

const resolve = require('path').resolve
const debug = require('debug')('rumaji')
const restify = require('restify')
const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['API-Token-Expiry']
})
const swaggerRoutes = require('swagger-routes')

const env = 'dev'
const config = require('config-yml')[env]

const docloader = require('./docloader')

process.on('unhandledRejection', function(err){
    console.log(err.stack);
    process.exit(1);
});

const server = restify.createServer()

server.pre(cors.preflight) // cors support preflight
server.use(cors.actual) // cors support
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
	.catch(err => {
		console.info('server error when start');
		console.log(err)
	})

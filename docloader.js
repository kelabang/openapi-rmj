/*
* @Author: d4r
* @Date:   2018-01-27 22:43:31
* @Last Modified by:   d4r
* @Last Modified time: 2018-01-28 01:49:01
*/

const SwaggerParser = require('swagger-parser')
const debug = require('debug')('rumaji:docloader')

module.exports = function docloader (docpath) {
	debug('load documentation ', docpath)
	return SwaggerParser.validate(docpath)
	  .then((api) => {
	  	debug('document valid ', docpath)
	  	// prepare swagger docs object
	    const maps = Object.keys(api.paths)
	    	.map(route => api.paths[route])
			.map(col => Object.keys(col).map((name) => col[name]))
			.reduce((acc, curr) => acc.concat(curr), [])
			.reduce((acc, curr) => {acc[curr.operationId] = curr; return acc;}, {})

		return {api, maps}
	  })
	  .catch((err) => {
	    debug('Onoes! The document is invalid. ' + err.message);
	  });

}
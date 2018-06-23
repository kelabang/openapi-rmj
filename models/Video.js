/*
* @Author: Imam
* @Date:   2018-06-07 05:49:37
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-08 00:11:36
*/

const name = 'Video'
const debug = require('debug')('rumaji'+name)
const moment = require('moment')
const bookshelf = require('./../bookshelf')
const Feed = require('./Feed')

let Videos
const Video = bookshelf.Model.extend({
	tableName: 'videos',
	constructor: function () {
		bookshelf.Model.apply(this, arguments)
		// this.on('creating', function (model, attrs, options) {
		// 	debug('on creating')
		// 	return this.validateCreate(model.changed)
		// })
		this.on('updating', function (model, attrs, options) {
			debug('on updating')
			model.set('updated', moment().format('YYYY-MM-DD HH:mm:ss'))
		})
	},
	feed: function () {
		return this.belongsTo(Feed)
	}
}) 

Videos = bookshelf.Collection.extend({
	model: Video
})

module.exports = Video
module.exports.collection = Videos
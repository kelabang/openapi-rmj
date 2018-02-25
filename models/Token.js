/*
* @Author: Imam
* @Date:   2018-02-03 15:08:34
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-10 02:58:34
*/

const name = 'Token'
const debug = require('debug')('rumaji:'+name)

const moment = require('moment')
const bookshelf = require('./../bookshelf')
const User = require('./User')

const Token = bookshelf.Model.extend({
	tableName: 'tokens',
	user_id: function () {return this.belongsTo(User, 'user_id')},
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
	}
})

module.exports = Token
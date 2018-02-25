/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-23 22:32:39
*/

const name = 'Feed'
const debug = require('debug')('rumaji:'+name)
const rules = {
	"content": "required"
}
const Checkit = require('checkit')
const checkit = new Checkit(rules)
const moment = require('moment')
const bookshelf = require('./../bookshelf')
const User = require('./User')


const Feed = bookshelf.Model.extend({
	tableName: 'feeds',
	constructor: function () {
		bookshelf.Model.apply(this, arguments)
		this.on('creating', function (model, attrs, options) {
			debug('on creating')
			return this.validateCreate(model.changed)
		})
		this.on('updating', function (model, attrs, options) {
			debug('on updating')
			model.set('updated', moment().format('YYYY-MM-DD HH:mm:ss'))
		})
	},
	validateCreate: function (attrs) {
		return checkit.run(attrs)
			.catch(Checkit.Error, function(err) {
				throw new Error(err)
			})
	},
	user: function () {
		return this.belongsTo(User)
	}
})

module.exports = Feed
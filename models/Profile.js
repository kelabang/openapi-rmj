/*
* @Author: Imam
* @Date:   2018-04-23 01:03:06
* @Last Modified by:   Imam
* @Last Modified time: 2018-04-23 22:16:44
*/

const name = 'Profile'
const debug = require('debug')('rumaji:'+name)
const Promise = require('bluebird')
const _ = require('lodash')

const bookshelf = require('./../bookshelf')
const User = require('./User')

const Profile = bookshelf.Model.extend({
	tableName: 'profiles',
	constructor: function () {
		const self = this
		bookshelf.Model.apply(this, arguments)
		this.on('creating', function (model, attrs, options) {
			debug('on creating')
		})
		this.on('updating', function (model, atrrs, options) {
			debug('on updating')
		})
	},
	user: function () {
		return this.belongsTo(User)
	}
})

module.exports = Profile
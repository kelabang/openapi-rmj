/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-09 01:09:03
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

let Feeds
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
	},
	comments: function () {
		return this.hasMany(Feeds, 'feed_id')
	}
})

Feeds = bookshelf.Collection.extend({
	model: Feed
},{
	feed: function (args) {
		const {limit} = args
		return this
			.query(function (qb) {
				qb.where('feed_id', null)
				qb.orderBy('created', 'DESC')
				qb.limit(limit)
			})
			.fetch({
				withRelated:[
					{"user": (qb) => {
						qb.column('username', 'id')
					}},
					"comments",
					{"comments.user": (qb) => {
						qb.column('username', 'id')
					}}
				]
			})
	},
	feedMoreNext: function (args) {
		console.error('feed more next, not implemented yet')
	},
	feedMorePrev: function (args) {
		debug('in feed more prev ')
		const {id, limit} = args
		return this
			.query(function (qb) {
				qb.where('id', '<', id)
				qb.where('feed_id', null)
				qb.orderBy('created', 'DESC')
				qb.limit(limit)
			})
			.fetch({
				withRelated: [
					{"user": (qb) => {
						qb.column('username', 'id')
					}},
					"comments",
					{"comments.user": (qb) => {
						qb.column('username', 'id')
					}}
				]
			})
	},
	feeduser: function (args) {
		const {id, limit, username} = args
		return this
			.query(function (qb) {
				qb.innerJoin('users', 'feeds.user_id', 'users.id')
				qb.where('users.username', username)
				qb.where('feeds.feed_id', null)
				qb.orderBy('feeds.created', 'DESC')
				qb.limit(limit)
			})
			.fetch({
				withRelated: [
					{"user": (qb) => {
						qb.column('username', 'id')
					}},
					"comments",
					{"comments.user": (qb) => {
						qb.column('username', 'id')
					}}
				]
			})
	},
	feeduserMorePrev: function (args) {
		const {id, limit, username} = args
		return this
			.query(function (qb) {
				qb.innerJoin('users', 'feeds.user_id', 'users.id')
				qb.where('users.username', username)
				qb.where('feeds.id', '<', id)
				qb.where('feeds.feed_id', null)
				qb.orderBy('feeds.created', 'DESC')
				qb.limit(limit)
			})
			.fetch({
				withRelated: [
					{"user": (qb) => {
						qb.column('username', 'id')
					}},
					"comments",
					{"comments.user": (qb) => {
						qb.column('username', 'id')
					}}
				]
			})
	}
})

module.exports = Feed
module.exports.collection = Feeds
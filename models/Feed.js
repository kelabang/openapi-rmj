/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-23 19:16:53
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
const Users = require('./User').collection
const TagUserFeed = require('./Tag').TagUserFeed

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
		return this.belongsTo(User, 'user_id')
	},
	comments: function (qb) {
		return this.hasMany(Feeds, 'feed_id')
	}, 
	mentions: function () {
		return this.belongsToMany(Users).through(TagUserFeed, 'feed_id', 'user_id')
	}
})

Feeds = bookshelf.Collection.extend({
	model: Feed
},{
	feed: function (args) {
		const {limit} = args
		return this
			.query(function (qb) {
				qb.select([
					'videos.*', 
					'feeds.*', 
					'videos.type as vtype'])
				qb.leftJoin('videos','feeds.id', 'videos.feed_id')
				qb.where('feeds.feed_id', null)
				qb.orderBy('feeds.created', 'DESC')
				qb.limit(limit)
			})
			.fetch({
				withRelated:[
					{"user": (qb) => {
						qb.column('username', 'id')
					}},
					"comments",
					{"comments.mentions": (qb) => {
						qb.column('username')
					}},
					{"comments.user": (qb) => {
						qb.column('username', 'id')
					}},
					{"mentions": (qb) => {
						qb.column(['username'])
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
				qb.select(['videos.*', 'feeds.*', 'videos.type as vtype'])
				qb.leftJoin('videos','feeds.id', 'videos.feed_id')
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
					}},
					{"mentions": (qb) => {
						qb.column(['username'])
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
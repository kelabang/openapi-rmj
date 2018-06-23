/*
* @Author: Imam
* @Date:   2018-06-21 00:22:58
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-22 00:30:40
*/

const name = 'Tag'
const debug = require('debug')('rumaji:'+name)
const bcrypt = require('bcrypt')
const checkit = require('checkit')
const Promise = require('bluebird')
const _ = require('lodash')

const bookshelf = require('./../bookshelf')
const pipeline = require('./../lib/promise/pipeline')

const User = require('./User')
const Feed = require('./Feed')

let 
	TagUserFeed,
	TagUsersFeeds,
	TagBookFeed,
	TagBooksFeeds

TagUserFeed = bookshelf.Model.extend({
	tableName: 'tag_feeds_users',
	user: () => {
		return this.belongsTo(User, 'user_id')
	},
	feed: () => {
		return this.belongsTo(Feed, 'feed_id')
	}
})

TagUsersFeeds = bookshelf.Collection.extend({
	model: TagUserFeed
})

TagBookFeed = bookshelf.Model.extend({
	tableName: 'tag_feeds_books'
})

TagBooksFeeds = bookshelf.Collection.extend({
	model: TagBookFeed
})

module.exports.TagUserFeed = TagUserFeed
module.exports.TagUsersFeeds = TagUsersFeeds
module.exports.TagBookFeed = TagBookFeed
module.exports.TagBooksFeeds = TagBooksFeeds

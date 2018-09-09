/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-07-05 22:34:23
*/

const name = 'Book'
const debug = require('debug')('rumaji:'+name)
const bookshelf = require('./../bookshelf')
const Feeds = require('./Feed').collection // load feeds
const TagBookFeed = require('./Tag').TagBookFeed

let Books

const Author = bookshelf.Model.extend({
	tableName: 'authors'
})

const Publisher = bookshelf.Model.extend({
	tableName: 'publishers'
})

const Book = bookshelf.Model.extend({
	tableName: 'books',
	publisher: function () {
		return this.belongsTo(Publisher, 'publisher_id')
	},
	author: function () {
		return this.belongsTo(Author, 'author_id')
	},
	feeds: function () {
		return this
			.belongsToMany('Feeds')
			.through(TagBookFeed, 'book_id', 'feed_id')
			
	}
})

Books = bookshelf.Collection.extend({
	model: Book
}, {
	book: function ({id, title, isbn}) {
		return this
			.query(function (qb) {
				if(id) qb.where('id', id)
				if(title) qb.where('title', title)
				if (isbn) {
					qb.where('isbn', isbn)
					qb.orWhere('isbn13', isbn)
				}
				return qb
			})
			.fetch({
				withRelated: [
					'publisher','author'
				]
			})
	},
	feedbookMorePrev: function ({id, limit, isbn }) {
		return this
			.query(function (qb) {
				qb.where('isbn', isbn)
				qb.orWhere('isbn13', isbn)
			})
			.fetch({
				withRelated: [
					{"feeds": (qb) => {
						qb.where('tag_feeds_books.feed_id', '<', id)
						qb.orderBy('created', 'DESC')
						qb.limit(limit)
					}},
					{
						"feeds.mentions": (qb) => {
							qb.column('username')
						}
					},
					{
						"feeds.user": (qb) => {
							qb.column('username', 'id')
						}
					},
					{
						"feeds.books": (qb) => {
							qb.column(['title', 'isbn', 'isbn13'])
						}
					}
				]
			})
	},
	feedbook: function ({id, limit, isbn}) {
		debug('feed', isbn)
		return this
			.query(function (qb) {
				qb.where('isbn', isbn)
				qb.orWhere('isbn13', isbn)
			})
			.fetch({
				withRelated: [
					{
						"feeds": (qb) => {
							qb.orderBy('created', 'DESC')
							qb.limit(limit)
						}
					},
					{
						"feeds.mentions": (qb) => {
							qb.column('username')
						}
					},
					{
						"feeds.user": (qb) => {
							qb.column('username', 'id')
						}
					},
					{
						"feeds.books": (qb) => {
							qb.column(['title', 'isbn', 'isbn13'])
						}
					}
				]
			})
	},
	checkValidISBN: function (attrs) {
		return Books.query(function (qb) {
			let i = 0
			do {
				if (i == 0) {
					qb.where('isbn', attrs[i])
					qb.orWhere('isbn13', attrs[i])
				}
				else {
					qb.orWhere('isbn', attrs[i])
					qb.orWhere('isbn13', attrs[i])
				}
				i++
			}
			while (i < attrs.length)
		})
		.fetch()
		.then(function (data) {
			return data.map(i => {
				return {
					title: i.get('title'),
					id: i.get('id')
				}
			})
		})
	} 
})

module.exports = bookshelf.model('Book', Book)
module.exports.collection = bookshelf.model('Books', Books)
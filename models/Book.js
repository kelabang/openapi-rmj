/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-07-05 22:34:23
*/

const name = 'Book'
const debug = require('debug')('rumaji:'+name)
const moment = require('moment')
const bookshelf = require('./../bookshelf')

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
	}
})

Books = bookshelf.Collection.extend({
	model: Book
}, {
	book: function ({id, title, isbn}) {
		return this
			.query(function (qb) {
				if(id) qb.where('id', id)
				if(isbn) qb.where('isbn', isbn)
				if(title) qb.where('title', title)
				return qb
			})
			.fetch({
				withRelated: [
					'publisher','author'
				]
			})
	}
})

module.exports = Book
module.exports.collection = Books
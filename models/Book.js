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
	book: function ({id, title, isbn, isbn13}) {
		return this
			.query(function (qb) {
				if(id) qb.where('id', id)
				if(isbn) qb.where('isbn', isbn)
				if(title) qb.where('title', title)
				if(isbn13) qb.where('isbn13', isbn13)
				return qb
			})
			.fetch({
				withRelated: [
					'publisher','author'
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

module.exports = Book
module.exports.collection = Books
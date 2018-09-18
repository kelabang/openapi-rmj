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
const BaseModel = require('./../bookshelf').BaseModel
const Feeds = require('./Feed').collection // load feeds
const TagBookFeed = require('./Tag').TagBookFeed

const { ISBN } = require('./../helper/index')

let Books

const Author = BaseModel.extend({
	tableName: 'authors'
})

const Publisher = BaseModel.extend({
	tableName: 'publishers'
})

const Book = BaseModel.extend({
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
	// insert authors to db , and return the id
	_insertAuthor: (authors = []) => {
		if(typeof authors.map !== 'function') return Promise.resolve([])
		console.log('_insertAuthor ', authors)
		let p = authors.map(async (author = null) => {
			console.log(' author name loop ', author)
			return await Author.exsert({
				name: author
			}, {
				name: author
			})
			.then(mod => mod.get('id'))
		})
		return Promise.all(p)
	},
	// insert publisher to db, and return teh id
	_insertPublisher: (publisher = null) => {
		if(!publisher) return Promise.resolve(null)
		const name = publisher.name
		return Publisher
			.exsert({
				name:publisher
			},{
				name: publisher
			})
			.then(mod => {
				console.log('mod ', mod)
				return mod.get('id')
			})
	},
	_saveFromNetwork: (books = []) => {
		debug('_saveFromNetwork', books)
		const _books = Books._convertDataNetwork(books)
		let _booksp = []
		_booksp = _books.map(_book => {
			const {
				authors,
				publisher,
			} = _book
			console.log('book', _book)
			console.log('authors _book', authors)
			console.log('publisher _book', publisher)
			const getAllId = []
			getAllId.push(Books._insertAuthor(authors))
			getAllId.push(Books._insertPublisher(publisher))
			getAllId.push(Promise.resolve(_book))
			return Promise
				.all(getAllId)
		})
		return Promise.all(_booksp).then((booksp) => {
			const allbooks = booksp.map(bookp => {
				const [authors, publishers, book] = bookp
				debug('finali output authors', authors)
				debug('finali output publishers', publishers)
				debug('finali output book', book)
				const toSendBook = {...book,
					// authors: undefined,
					// publisher: undefined,
					genre_id: 1,
					author_id: authors.pop(),
					publisher_id: publishers,
					
				}

				delete toSendBook.authors
				delete toSendBook.publisher
				delete toSendBook.genre

				const {id, title} = book

				return Book
					.forge(toSendBook)
					.save()
					.then(book => ({
						id: book.id,
						title: book.title
					}))
			})
			return Promise.all(allbooks)
		})
	},
	_convertDataNetwork: (books = []) => {
		debug('_convertDataNetwork', books)
		let _books = []
		for (let i = 0; i < books.length; i++) {
			const book = books[i];
			let {
				title,
				subtitle,
				authors,
				publisher,
				publishedDate:published,
				industryIdentifiers,
				categories: genre,
				averageRating,
				ratingsCount,
				pageCount: page,
				maturityRating,
				imageLinks,
				language,
				infoLink
			} = book

			let cover_url = ''
			let isbn = ''
			let isbn13 = ''

			if(imageLinks) {
				const {
					thumbnail
				} = imageLinks
				cover_url = thumbnail
			}

			if(industryIdentifiers) {
				industryIdentifiers.map(identifier => {
					switch (identifier.type) {
						case 'ISBN_10':
							isbn = identifier.identifier
							break;
						case 'ISBN_13':
							isbn13 = identifier.identifier
							break;
					}
				})
			}

			published = moment(published).format('YYYY-MM-DD')

			const _book = {
				title,
				subtitle,
				cover_url,
				published,
				page,
				genre,
				authors,
				publisher,
				isbn,
				isbn13,
			}

			if(industryIdentifiers && industryIdentifiers.length > 0) _books.push(_book)
		}
		return _books
	},
	resolveFromNetwork: (isbns = []) => {
		const books = []
		return ISBN
			.resolves(isbns)
			.then(books => {
				books = books.filter(Boolean) // filter null
				return Books._saveFromNetwork(books) // save data to db
			})
	},
	checkValidISBN: function (attrs) {
		const self = this
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

			let _isbns = [...attrs]

			let output = []

			// filter data not found 
			if(data.length > 0) {
				output = data.map(item => {
					const isbn13 = item.get('isbn13')
					const isbn = item.get('isbn')
					let index = -1
					// remove isbn13 match
					index = _isbns.indexOf(isbn13)
					if (index > -1) _isbns.splice(index, 1)
					// remove isbn match
					index = _isbns.indexOf(isbn)
					if(index > -1) _isbns.splice(index, 1)
					return {
						title: item.get('title'),
						id: item.get('id')
					}
				})
			}
			debug('rest of isbn', _isbns)
			// theres isbn not resolved, so we search through network
			if(_isbns.length > 0)  {
				return self
					.resolveFromNetwork(_isbns)
					.then(books => {
						const _books = [] // fake
						const dat = [...output, ...books]
						debug('result of resolve network ', dat)
						return dat
					})
			}
			debug('all found just return all isbn')
			return output
		})
	} 
})

module.exports = bookshelf.model('Book', Book)
module.exports.collection = bookshelf.model('Books', Books)
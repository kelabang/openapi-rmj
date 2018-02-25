/*
* @Author: d4r
* @Date:   2018-01-23 01:18:52
* @Last Modified by:   Imam
* @Last Modified time: 2018-01-31 00:34:48
*/
const knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './dev.sqlite3',
		useNullAsDefault: true
	}
})

const bookshelf = require('bookshelf')(knex)
bookshelf.plugin('pagination') // to use pagination `fetchPage`

module.exports = bookshelf
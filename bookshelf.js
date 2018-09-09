/*
* @Author: d4r
* @Date:   2018-01-23 01:18:52
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-31 19:06:09
*/
// const knex = require('knex')({
// 	client: 'sqlite3',
// 	connection: {
// 		filename: './dev.sqlite3',
// 		useNullAsDefault: true
// 	}
// })

const config = require('./knexfile.js')

const knex = require('knex')(config.staging)

const bookshelf = require('bookshelf')(knex)
bookshelf.plugin('pagination') // to use pagination `fetchPage`
bookshelf.plugin('registry') // circular dependencies resolver
module.exports = bookshelf

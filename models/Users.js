/*
* @Author: d4r
* @Date:   2018-01-28 17:46:55
* @Last Modified by:   Imam
* @Last Modified time: 2018-01-30 23:53:50
*/

const bookshelf = require('./../bookshelf')
const User = require('./User')

const Stories = bookshelf.Collection.extend({
	model: User
})

module.exports = Users
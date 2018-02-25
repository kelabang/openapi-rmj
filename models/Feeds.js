/*
* @Author: d4r
* @Date:   2018-01-28 17:46:55
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-22 22:18:37
*/

const bookshelf = require('./../bookshelf')
const Feed = require('./Feed')

const Feeds = bookshelf.Collection.extend({
	model: Feed
})

module.exports = Feeds
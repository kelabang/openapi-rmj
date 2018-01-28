/*
* @Author: d4r
* @Date:   2018-01-28 17:46:55
* @Last Modified by:   d4r
* @Last Modified time: 2018-01-28 17:52:12
*/

const bookshelf = require('./../bookshelf')
const Story = require('./Story')

const Stories = bookshelf.Collection.extend({
	model: Story
})

module.exports = Stories
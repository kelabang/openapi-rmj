/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   d4r
* @Last Modified time: 2018-01-25 00:09:22
*/

const bookshelf = require('./../bookshelf')

const Story = bookshelf.Model.extend({
	tableName: 'stories'
})

module.exports = Story
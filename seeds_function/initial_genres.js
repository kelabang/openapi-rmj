/*
* @Author: Imam
* @Date:   2018-06-24 18:48:50
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-24 18:57:19
*/

module.exports = function (knex) {
	return knex('genres')
		.returning(['id'])
		.insert([
			{id: 1, name: 'non-fiction'},
			{id: 2, name: 'drama'},
			{id: 3, name: 'fiction'},
			{id: 4, name: 'horror'},
			{id: 5, name: 'thriller'}
		])
}
/*
* @Author: Imam
* @Date:   2018-06-24 18:51:05
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-24 19:30:04
*/

module.exports = function (knex) {
	return knex('authors')
		.returning(['id'])
		.insert([
			{id: 1, name: 'Amy Bloom'},
			{id: 2, name: 'George R.R. Martin'}
		])
}
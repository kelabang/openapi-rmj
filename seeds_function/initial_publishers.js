/*
* @Author: Imam
* @Date:   2018-06-24 18:52:43
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-24 19:29:06
*/

module.exports = function (knex) {
	return knex('publishers')
		.returning(['id'])
		.insert([
			{id: 1, name: 'Random House Large Print'},
			{id: 2, name: 'HarperVoyager'},
			{id: 3, name: 'HarperCollins Publishers'}
		])
}
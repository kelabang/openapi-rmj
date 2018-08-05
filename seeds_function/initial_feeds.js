/*
* @Author: Imam
* @Date:   2018-05-31 11:44:43
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-31 21:26:32
*/

module.exports = function (knex) {
	return knex('feeds').insert([
		{id: 1, type:1, content: 'yuk, rutin baca buku', user_id: 2},
		{id: 2, type:1, content: 'Haii, selamat datang di Rumaji!', user_id: 2},
		{id: 3, type:1, content: 'Cuaca cerah ya', user_id: 1}
	])
} 
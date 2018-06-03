/*
* @Author: Imam
* @Date:   2018-05-31 11:44:43
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-31 21:26:32
*/

module.exports = function (knex) {
	return knex('feeds').insert([
		{id: 1, type:1, content: 'siang1 ini saya bertemu dengan kucing yang lucu, kemudian hujan datang', user_id: 1},
		{id: 2, type:1, content: 'siang2 ini saya bertemu dengan kucing yang lucu, kemudian hujan datang', user_id: 1},
		{id: 3, type:1, content: 'siang3 ini saya bertemu dengan kucing yang lucu, kemudian hujan datang', user_id: 1}
	])
} 
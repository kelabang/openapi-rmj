/*
* @Author: Imam
* @Date:   2018-05-31 11:44:43
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-31 21:26:17
*/

module.exports = function (knex) {
	return knex('users')
	.returning(['id'])
	.insert([
	  {id: 1, username: 'admin', email: 'imam@gmail.com', password: '$2a$10$1xzhGT6QwLMiHGRYQZpfnOzAeOIR7/3IVyBAjsPnanTd8pEiCnqGi'},
	  {id: 2, username: 'kucingbelang4', email: 'kuc@rumaji.com', password: '$2a$10$1xzhGT6QwLMiHGRYQZpfnOzAeOIR7/3IVyBAjsPnanTd8pEiCnqGi'},
	  {id: 3, username: 'ma4m', email: 'kel@rumaji.com', password: '$2a$10$1xzhGT6QwLMiHGRYQZpfnOzAeOIR7/3IVyBAjsPnanTd8pEiCnqGi'},
	  {id: 4, username: 'nooble', email: 'imam.tauhid.dar@gmail.com', password: '$2a$10$1xzhGT6QwLMiHGRYQZpfnOzAeOIR7/3IVyBAjsPnanTd8pEiCnqGi'},
	])
} 
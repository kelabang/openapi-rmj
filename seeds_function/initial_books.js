/*
* @Author: Imam
* @Date:   2018-06-24 18:57:46
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-24 19:35:21
*/

module.exports = function (knex) {
	return knex('books')
		.returning(['id'])
		.insert([
			{id: 1, published: '2018-02-01', cover_url: 'https://images-na.ssl-images-amazon.com/images/I/519Sk0QQWVL._SL200_.jpg', title: 'White Houses', subtitle: 'HarperCollins Publishers', isbn: '0525589929', page: 320, genre_id: 1, author_id: 1, publisher_id: 1},
			{id: 2, published: '2017-11-01', cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51bmeWL8zhL._SL200_.jpg', title: 'A Knight of the Seven Kingdoms', subtitle: 'A Knight of The Seven Kingdoms compiles the first three official prequel novellas to George R.R. Martin\'s ongoing masterwork, A Song of Ice and Fire.', isbn: '000823809X', page: 368, genre_id: 2, author_id: 2, publisher_id: 2},
			{id: 3, published: '2011-09-01', cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51sOF18SI%2BL._SL200_.jpg', title: 'A Storm of Swords: Steel and Snow: Book 3 Part 1 of a Song of Ice and Fire', subtitle: 'HBO\'s hit series A GAME OF THRONES is based on George R R Martin\'s internationally bestselling series A SONG OF ICE AND FIRE, the greatest fantasy epic of the modern age.', isbn: '0007447841', page: 640, genre_id: 2, author_id: 2, publisher_id: 1}
		])
}
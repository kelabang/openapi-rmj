
exports.up = function(schema, fn) {
	return schema.createTable('books', function (t) {
		t.increments('id').unsigned().primary()

		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()
		t.date('published').nullable()

		t.string('title', 80).notNullable()
		t.text('subtitle').nullable()
		t.text('cover_url').nullable()
		t.string('isbn', 20).nullable()
		t.integer('page', 11).nullable()

		t.integer('genre_id').unsigned().defaultTo(0).notNullable()
		t.foreign('genre_id').references('genres.id')

		t.integer('author_id').unsigned().nullable()
		t.foreign('author_id').references('authors.id')

		t.integer('publisher_id').unsigned().nullable()
		t.foreign('publisher_id').references('publishers.id')

	})
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('books') 
};

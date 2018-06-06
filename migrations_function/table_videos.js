
exports.up = function(schema, fn) {
	return schema.createTable('videos', function (t) {
		t.increments('id').unsigned().primary()

		t.timestamp('created').defaultTo(fn.now()).notNullable()
		t.timestamp('deleted').nullable()
		t.timestamp('updated').nullable()

		t.string('title', 80).notNullable()
		t.text('path')
		t.string('type', 20).defaultTo('jwp')
		t.integer('size', 50)
		t.string('mime', 20)
		t.text('md5')
		t.integer('feed_id').unsigned()
		t.foreign('feed_id').references('feeds.id')

	})
};

exports.down = function(schema, fn) {
	return schema.dropTableIfExists('videos') 
};

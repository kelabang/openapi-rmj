
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('feeds').del()
    .then(function () {
      // Inserts seed entries
      return knex('feeds').insert([
        {id: 1, type:1, content: 'siang ini saya bertemu dengan kucing yang lucu, kemudian hujan datang', user_id: 1},
        {id: 2, type:1, content: 'siang ini saya bertemu dengan kucing yang lucu, kemudian hujan datang', user_id: 1},
        {id: 3, type:1, content: 'siang ini saya bertemu dengan kucing yang lucu, kemudian hujan datang', user_id: 1}
      ]);
    });
};

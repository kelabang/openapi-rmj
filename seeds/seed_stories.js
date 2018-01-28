
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('stories').del()
    .then(function () {
      // Inserts seed entries
      return knex('stories').insert([
        {id: 1, title: 'rowValue1', content: 'sore hari 1', status: 'draft'},
        {id: 2, title: 'rowValue2', content: 'sore hari 2', status: 'draft'},
        {id: 3, title: 'rowValue3', content: 'sore hari 3', status: 'draft'}
      ]);
    });
};
 
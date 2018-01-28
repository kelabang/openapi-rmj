const schema = {
  title: 'Story Schema',

  definitions: {
    Category: require('./Category.js')
  },

  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    title: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    category: {
      $ref: '#/definitions/Category'
    }
  },
  required: ['id', 'title', 'status']
}
module.exports = schema
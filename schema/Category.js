const schema = {
  title: 'Category Schema',
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    name: {
      type: 'string'
    }
  },
  required: ['id','name']
}
module.exports = schema
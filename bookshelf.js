/*
* @Author: d4r
* @Date:   2018-01-23 01:18:52
* @Last Modified by:   Imam
* @Last Modified time: 2018-05-31 19:06:09
*/
// const knex = require('knex')({
// 	client: 'sqlite3',
// 	connection: {
// 		filename: './dev.sqlite3',
// 		useNullAsDefault: true
// 	}
// })

const config = require('./knexfile.js')

const knex = require('knex')(config.staging)

const bookshelf = require('bookshelf')(knex)
bookshelf.plugin('pagination') // to use pagination `fetchPage`
bookshelf.plugin('registry') // circular dependencies resolver

const BaseModel = bookshelf.Model.extend({}, {
    /**
     * Select a model based on a query
     * @param {Object} selectData
     * @param {Function} [callback]
     * @return {Promise}
     */
    findOne: function (selectData, callback) {
        return this.forge(selectData).fetch(callback);
    },
    /**
     * @param {Object} selectData
     * @param {Object} updateData
     * @returns {Promise}
     */
    exsert: async function (selectData, updateData) {
        const existingModel = await this.findOne(selectData);
        if (existingModel) {
            return await existingModel
        } else {
            return await new this(updateData).save();
        }
    },
    /**
     * @param {Object} selectData
     * @param {Object} updateData
     * @returns {Promise}
     */
    upsert: async function (selectData, updateData) {
        const existingModel = await this.findOne(selectData);
        if (existingModel) {
            return await existingModel.set(updateData).save();
        } else {
            return await new this(updateData).save();
        }
    }
})

module.exports = bookshelf
module.exports.BaseModel = BaseModel

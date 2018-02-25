/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-22 00:24:03
*/

const name = 'User'
const debug = require('debug')('rumaji:'+name)
const bcrypt = require('bcrypt')
const checkit = require('checkit')
const Promise = require('bluebird')
const _ = require('lodash')

const bookshelf = require('./../bookshelf')
const pipeline = require('./../lib/promise/pipeline')

const rules = {
	"email": "required",
	"username": "required",
	"password": "required"
}

const User = bookshelf.Model.extend({
	tableName: 'users',
	constructor: function () {
		const self = this
		bookshelf.Model.apply(this, arguments)
		this.on('creating', function (model, attrs, options) {
			debug('on creating')
			const tasks = [
				() => self.validateCreate(model.changed),
				() => self.hashPassword(model, attrs, options),
			]
			return pipeline(tasks)
		})
		this.on('updating', function (model, attrs, options) {
			debug('on updating')
			model.set('updated', moment().format('YYYY-MM-DD HH:mm:ss'))
		})
		this.on('saving', function (model, attrs, options) {
			debug('on saving')
			return self._assertEmailUnique(model, attrs, options)
		})
		this.on('saved', function (model, response, options) {
			debug('on saved')
			debug('remove password hash, prevent password exposed')
			this.set('password', undefined)
		})
	},
	_assertEmailUnique: function(model, attributes, options) {
	    if (this.hasChanged('email')) {
	    	debug('on email changing')
			return User
				.query('where', 'email', this.get('email'))
				.fetch(_.pick(options || {}, 'transacting'))
				.then(function(existing) {
					debug('is email exist ? ', existing)
					if (existing) {
						debug('duplicate email existing')
						throw new Error('Duplicated email: User id #' + existing.id);
					}
				});
	    }
	},
	_hash: function (password) {
		debug('on low-level _hash')
		return new Promise(function (resolve, reject) {
			bcrypt.hash(password, 10, function (err, hash) {
				if( err ) return reject(err);
				resolve(hash); // data is created only after this occurs
			})
		})
	},
	comparePassword: function (password, hashpassword) {
		return new Promise(function (resolve, reject) {
			bcrypt.compare(password, hashpassword, function (err, res) {
				if( err ) return reject(err);
				resolve(res); // data is created only after this occurs
			})
		})
	},
	hashPassword: function (model, attrs, options) {
		return this._hash(model.attributes.password)
			.then(hash => {
				model.set('password', hash)
				return hash
			})
		// return new Promise(function(resolve, reject) {
		// 	self._hash()
		// 	bcrypt.hash(model.attributes.password, 10, function(err, hash) {
		// 		if( err ) reject(err);
		// 		model.set('password', hash);
		// 		resolve(hash); // data is created only after this occurs
		// 	});
		// });
	},
	validateCreate: function (attrs) {
		debug('validate creating')
		return checkit(rules).run(attrs)
	}
})

module.exports = User
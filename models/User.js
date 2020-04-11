/*
* @Author: d4r
* @Date:   2018-01-23 01:22:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-06-21 21:52:49
*/

const name = 'User'
const debug = require('debug')('rumaji:'+name)
const bcrypt = require('bcryptjs')
const checkit = require('checkit')
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')

const bookshelf = require('./../bookshelf')
const pipeline = require('./../lib/promise/pipeline')

const rules = {
	"email": "required",
	"username": "required",
	"password": "required"
}

let UserSocial,
	User,
	Users,
	UserProfile

User = bookshelf.Model.extend({
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
		this.on('updating', function (model) {
			debug('on updating')
			model.set('updated', moment().format('YYYY-MM-DD HH:mm:ss'))
		})
		this.on('saving', function (model, attrs, options) {
			debug('on saving')
			return self._assertEmailUnique(model, attrs, options)
				.catch(err => {
					throw err
				})
		})
		this.on('saved', function () {
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
					debug('is email exist ? ' + !!existing)
					if (existing) {
						debug('Duplicated email: User id #' + existing.id);
						throw 'duplicate_email'
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
	hashPassword: function (model) {
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
	},
	profile: function () {
		return this.hasOne(UserProfile, 'user_id')
	}
}, {
	registeringUser: function (attrs) {
		const {
			username, email, password, ref_id, ref_type
		} = attrs
		const user = new User({
			username, email, password
		})
		return user.save()
		.then(user => {
			const user_id = user.get('id')

			if(!ref_id || !ref_id || !ref_type) 
				return user
			
			const usersoc = new UserSocial({
				user_id: user_id,
				social_id: ref_id,
				social_type: ref_type
			})

			return usersoc
				.save()
				.then(() => user)

		})
	},
	getProfileById: function (id) {
		return User	
			.where('id', id)
			.fetch()
			.then(user => {
				debug('user ', user)
				const profile = user.profile()
				const payload = user.attributes
				payload.password = undefined
				payload.profile = profile
				return payload
			})
	},
	getProfileByUsername: function (username) {
		return User
			.where('username', username)
			.fetch()
			.then(user => {
				debug('user ', user)
				const profile = user.profile()
				const payload = user.attributes
				payload.password = undefined
				payload.profile = profile
				return payload
			})
	}
})

UserSocial = bookshelf.Model.extend({
	tableName: 'user_socials',
	user: function () {
		return this.belongsTo(User)
	}
}, {
	getUserByFacebookId: function (facebookId) {
		debug('getUserByFacebookId ',facebookId)
		return UserSocial
			.query(function (qb) {	
				return qb.where('social_id', '=', facebookId)
					.where('social_type', '=', 1)
			})
			.fetch()
			.then(usersoc => {
				debug('::-- response usersoc', usersoc)
				if(!usersoc) {
					debug('not account attached yet ')
					return false
				}
				const {user_id} = usersoc.attributes 
				return User.query(function (qb) {
					qb.where('id', user_id)
					qb.limit(1)
				})
				.fetch()
			})
	}
})

UserProfile = bookshelf.Model.extend({
	tableName: 'profiles',
	idAttribute: 'user_id',
	user: function () {
		return this.belongsTo(User)
	}
})

Users = bookshelf.Collection.extend({
	model: User
}, {
	checkValidUsernames: function (attrs) {
		return Users.query(function (qb) {
			let i = 0
			do {
				if(i == 0) 
					qb.where('username', attrs[i])
				else
					qb.orWhere('username', attrs[i])
				i++
			}
			while(i < attrs.length)
		})
		.fetch()
		.then(function (data) {
			return data.map(i => {
				return {
					username: i.get('username'),
					id: i.get('id')
				}
			})
		})
	}
})

module.exports = bookshelf.model('User',User)
module.exports.UserSocial = bookshelf.model('UserSocial',UserSocial)
module.exports.collection = bookshelf.model('Users',Users)
module.exports.UserProfile = bookshelf.model('UserProfile',UserProfile)
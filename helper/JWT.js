/*
* @Author: Imam
* @Date:   2018-02-03 20:15:40
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-10 00:18:59
*/

const debug = require('debug')('rumaji:JWT')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')
const pem = require('pem')

const JWT = {
	genParams: (issuer, expire, algorithm) => {
		debug('generate params')
		const iss = issuer || 'rumaji.com'
		const exp = expire || 60*60
		const alg = algorithm || 'RS256'
		return {
			algorithm: alg,
			expiresIn: exp,
			issuer: iss,
		}
	},
	genKey: () => {
		debug('generate private key')
		return new Promise ((res, rej) => {
			pem.createCertificate({days:1,selfSigned:true}, (err, keys) => {
				if(err) return rej(err)
				debug('keys', keys)
				res(keys)
			})
		}) 
	},
	decode: (token) => {
		debug('decode token')
		return jwt.decode(token)
	},
	verify: (token, certificate, cb) => jwt.verify(token, certificate, cb),
	sign: (payload, key, params) => {
		debug('generate signature')
		return new Promise((res, rej) => {
			if(!payload) return rej(new Error('payload empty'))
			const {id, iat} = payload
			let upPayload = {id, iat}
			jwt.sign(payload, key, params, (err, data) => {
				if(err) return rej(err)
				return res(data)
			})
		})
	}
}

module.exports = JWT 
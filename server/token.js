const jwt = require('jsonwebtoken');
const util = require('util')
const { getUserByUsername } = require('./db')

const asyncVerify = util.promisify(jwt.verify).bind(jwt)

const createToken = (username, salt) => {
  return jwt.sign({ username }, salt, { expiresIn: 7 * 24 * 60 * 60 })
}

const verifyToken = async (token, salt) => {
  try {
    await asyncVerify(token, salt)
    return true
  } catch (e) {
    return false
  }
}

const auth = async (token) => {
  const data = decode(token)
  if (!data || !data.username) {
    return {
      note: 'Token is invalid',
      success: false
    }
  }
  const { username } = data
  const user = await getUserByUsername(username)
  const isValid = await verifyToken(token, user.salt)
  return {
    id: user.id,
    success: isValid,
    note: `Token is ${isValid ? 'valid' : 'invalid'}`
  }
}

const decode = jwt.decode

module.exports = {
  auth,
  createToken,
  verifyToken,
  decode,
}
const crypto = require('crypto')

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt,  
    1000, 64, `sha512`).toString(`hex`); 
}

const checkPassword = (password, hash, salt) => {
  const hashedPassword = hashPassword(password, salt)
  return hashedPassword === hash
}

module.exports = {
  hashPassword,
  checkPassword
}
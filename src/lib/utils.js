const bcrypt = require('bcryptjs')

const createHashPassword = async function(password) {
    let salt = '';
    let hashedPass = '';
    salt = await bcrypt.genSalt(10);
    hashedPass = await bcrypt.hash(password, salt);
    return hashedPass
}

module.exports = {
    createHashPassword
}
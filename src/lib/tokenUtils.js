const jwt = require('jsonwebtoken');
const moment = require('moment');
const parametros = require('./configParameters')

const comprobarToken = (token, tokenKey) => {
    let payload = null;
    let nErrores = 0;

    try {
        payload = jwt.decode(token, tokenKey);
    } catch(err) {
        nErrores++;
    }
    if(nErrores==0 && payload) {
        if(moment().unix() > payload.exp) {
            nErrores++;
        }
        if(moment().unix() < payload.iat) {
            nErrores++;
        }
    }
    return (nErrores == 0 ? payload.sub : null)
}

const createToken = (user, tokenKey, timestampCreatedAt, timestampExpiration) => {
    let payload = {
        sub: user.guid,
        iat: timestampCreatedAt,
        exp: timestampExpiration
    }
    return jwt.sign(payload, tokenKey)
}

module.exports = {
    createToken,
    comprobarToken
}
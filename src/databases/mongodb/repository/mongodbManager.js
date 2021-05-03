const { MongoClient } = require('mongodb')

const crearConexion = async function(host, user, password, dbName) {
    return new Promise(async function(resolve, reject) {
        try {
            //const connStr = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`;
            const connStr = `mongodb+srv://${user}:${password}@${host}/${dbName}?retryWrites=true&w=majority&useUnifiedTopology=true`;
            resolve(await MongoClient(connStr).connect());
        } catch(err) {
            reject()
        }
    })
}

const cerrarConexion = async function(conexion) {
    return new Promise(function(resolve,reject) {
        if(conexion){
            conexion.close(function(err) {
                if(err) {
                    reject(err);
                }
                resolve()
            })
        }
        else {
            resolve()
        }
    })
}

module.exports = {
    crearConexion,
    cerrarConexion
}
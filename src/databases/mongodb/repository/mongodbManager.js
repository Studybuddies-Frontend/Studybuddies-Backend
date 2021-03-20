const { MongoClient } = require('mongodb')

const crearConexion = async function(user, password, dbName) {
    return new Promise(async function(resolve, reject) {
        try {
            const connStr = `mongodb+srv://${user}:${password}@cluster0.p7sle.mongodb.net/${dbName}?retryWrites=true&w=majority&useUnifiedTopology=true`;
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
                    console.log("Error al cerrar la conexion con base de datos Mongo")
                    reject(err);
                }
                console.log("Conexion Mongo cerrada")
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
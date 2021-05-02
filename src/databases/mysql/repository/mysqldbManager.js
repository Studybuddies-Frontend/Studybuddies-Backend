const mysql = require('mysql');

const crearConexion = function(host, port, user, password, dbName) {
    return new Promise(function(resolve, reject) {
        let conexion = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            port: port,
            database: dbName
        });

        conexion.connect(function(err) {
            if (err) {
                reject(err);
            }
            resolve(conexion);
        });
    });
}


const cerrarConexion = function(conexion) {
    return new Promise(function(resolve, reject) {

        if (conexion) {
            conexion.end(function(err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        }
        else{
            resolve();
        }
    });
}

module.exports = {
    crearConexion,
    cerrarConexion
}

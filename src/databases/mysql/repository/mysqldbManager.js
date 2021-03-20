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
                console.log('Error al conectar con base de datos mysql');
                reject(err);
            }
            console.log('Conexion Mysql creada');
            resolve(conexion);
        });
    });
}


const cerrarConexion = function(conexion) {
    return new Promise(function(resolve, reject) {

        if (conexion) {
            conexion.end(function(err) {
                if (err) {
                    console.log('Error al cerrar la conexion con base de datos mysql');
                    reject(err);
                }
                console.log('Conexion Mysql cerrada');
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

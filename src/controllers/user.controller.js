const bcrypt = require('bcryptjs')
const parametros = require('../lib/configParameters')
const tokenUtils = require('../lib/tokenUtils')

const mysqlConnection = require('../databases/mysql/repository/mysqldbManager');
const mysqlUser = require('../databases/mysql/models/user.model')

const login = async function(req, res) {
    let username = '';
    let password = '';
    let role = '';
    let user = {};
    let result = {};
    let nErrores = 0;
    let validPass = false;
    let statusCode = 0;
    let statusMessage = '';

    let conexionMysql = {};

    let configuracion = parametros.configuracion();

    if(req.body) {
        if(req.body.username) {
            username = req.body.username;
        }
        if(req.body.password) {
            password = req.body.password;
        }
    }

    if(!username) {
        statusCode = 404;
        statusMessage = 'Username not found';
        nErrores++;
    }
    if(!password) {
        statusCode = 404;
        statusMessage = 'Password not found';
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    if (nErrores == 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
        } catch (err) {
            console.log('Error al crear la conexion con mysql. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }

    // Recupero el usuario de la BD
    if(nErrores == 0) {
        try {
            user = await mysqlUser.getByUsername(conexionMysql, username)
            if (!user) {
                statusCode = 401;
                statusMessage = 'Invalid Credentials';
                nErrores++;
            }
        }
        catch(err) {
            console.log(`Error al obtener el usuario ${username}.`);
            statusCode = 500;
            statusMessage = 'Invalid Username';
            nErrores++;
        }
    }

    // Comprobamos que la contraseña coincide
    if(nErrores == 0) {
        role = user.role
        id = user.id
        validPass = await bcrypt.compare(password, user.password)
        if(!validPass) {
            statusCode = 401;
            statusMessage = 'Invalid Credentials';
            nErrores++;
        }
        else {
            result.username = username;
            result.role = role; 
            result.id = id;
        }
    }

    // Cerramos la conexion mysql
    if (conexionMysql) 
    {
        await mysqlConnection.cerrarConexion(conexionMysql);
    }

    // Devolvemos la respuesta
    if (nErrores == 0) {
        console.log(`Login realizado correctamente para el usuario ${username}`)
        res.status(200)
            .json(result);
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

module.exports = {
    login
}
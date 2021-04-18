const bcrypt = require('bcryptjs')
const parametros = require('../lib/configParameters')
const constants = require('../lib/constants')
const utils = require('../lib/utils')

const mysqlConnection = require('../databases/mysql/repository/mysqldbManager');
const mysqlUser = require('../databases/mysql/models/user.model')

const login = async function (req, res) {
    let username = '';
    let password = '';
    let role = '';
    let user = {};
    let result = {};
    let nErrores = 0;
    let validPass = false;
    let statusCode = 0;
    let statusMessage = '';
    let id = null;

    let conexionMysql = {};
    let existeConexionMysql = false;

    let configuracion = parametros.configuracion();

    if (req.body) {
        if (req.body.username) {
            username = req.body.username;
        }
        if (req.body.password) {
            password = req.body.password;
        }
    }

    if (!username) {
        statusCode = 404;
        statusMessage = 'Username not found';
        nErrores++;
    }
    if (!password) {
        statusCode = 404;
        statusMessage = 'Password not found';
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    if (nErrores == 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
            existeConexionMysql = true
        } catch (err) {
            console.log('Error al crear la conexion con mysql. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }

    // Recupero el usuario de la BD
    if (nErrores == 0) {
        try {
            user = await mysqlUser.getByUsername(conexionMysql, username)
            if (!user) {
                statusCode = 401;
                statusMessage = 'Invalid Credentials';
                nErrores++;
            }
        }
        catch (err) {
            console.log(`Error al obtener el usuario ${username}.`);
            statusCode = 500;
            statusMessage = 'Invalid Username';
            nErrores++;
        }
    }

    // Comprobamos que la contraseña coincide
    if (nErrores == 0) {
        role = user.role
        id = user.id
        validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
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
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            console.log(`Error al cerrar la conexion con mysql. ${err}`);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
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

//<<<<<<< Alejandro_Registro#36
const registerAlumno = async function (req, res) {
    let username = '';
    let password = '';
    let confirmPassword = '';
    let nombre = '';
    let apellidos = '';
    let email = '';
    let universidad = '';
    let grado = '';
    let userExiste = {};
    let user = {};
    let result = {};
    let hashPass = '';
//=======
const getUsuarioById = async function (req, res) {
    let idUsuario = 0;
    let user = {};
    let result = {};
//>>>>>>> develop-v2
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';

    let conexionMysql = {};
//<<<<<<< Alejandro_Registro#36
    let existeConexionMysql = false;

    let configuracion = parametros.configuracion();

    if (req.body) {
        if (req.body.username) {
            username = req.body.username;
        }
        if (req.body.password) {
            password = req.body.password;
        }
        if (req.body.confirmPassword) {
            confirmPassword = req.body.confirmPassword;
        }
        if (req.body.nombre) {
            nombre = req.body.nombre;
        }
        if (req.body.apellidos) {
            apellidos = req.body.apellidos;
        }
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.universidad) {
            universidad = req.body.universidad;
        }
        if (req.body.grado) {
            grado = req.body.grado;
        }
    }

    if (!username) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un nombre de usuario';
        nErrores++;
    }
    if (!password) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una contraseña';
        nErrores++;
    }
    if (!confirmPassword) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una contraseña de confirmacion';
        nErrores++;
    }
    if (!nombre) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un nombre';
        nErrores++;
    }
    if (!apellidos) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado unos apellidos';
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un email';
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un email';
        nErrores++;
    }
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un email válido';
        nErrores++;
    }
    if (!universidad) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una universidad';
        nErrores++;
    }
    if (!grado) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un grado';
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    if (nErrores == 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
            existeConexionMysql = true;
        } catch (err) {
            console.log('Error al crear la conexion con mysql. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }

    if (nErrores == 0) {
        // Compruebo que no existe un usuario con el username
        try {
            userExiste = await mysqlUser.getByUsername(conexionMysql, username)
            if (userExiste) {
                statusCode = 200;
                statusMessage = 'Este nombre de usuario ya existe';
                nErrores++;
            }
            else {
                // Comprobamos que no existe un usuario con el email
                try {
                    userExiste = await mysqlUser.getByEmail(conexionMysql, email)
                    if (userExiste) {
                        statusCode = 200;
                        statusMessage = 'Este email ya existe';
                        nErrores++;
                    }
                    else {
                        // Comprobamos que las contraseñas coinciden
                        if (password != confirmPassword) {
                            statusCode = 200;
                            statusMessage = 'Las contraseñas deben coincidir';
                            nErrores++;
                        }
                    }
                }
                catch (err) {
                    console.log(`Error al obtener el email ${email}.`);
                    statusCode = 500;
                    statusMessage = 'Invalid Email';
                    nErrores++;
                }
            }
        }
        catch (err) {
            console.log(`Error al obtener el usuario ${username}.`);
            statusCode = 500;
            statusMessage = 'Invalid Username';
            nErrores++;
        }
    }

    // Continuamos si no existen dichos datos ya
    if (nErrores == 0) {
        hashPass = await utils.createHashPassword(password);
        user = { username: username, password: hashPass, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: null, idRole: constants.ID_ROLE_ALUMNO }
        console.log(user)
        // Introducimos en mysql el usuario con role de alumno
        try {
            result = await mysqlUser.saveUsuario(conexionMysql, user);
        }
        catch (err) {
            console.log(`Error al insertar el usuario en base de datos.`);
            statusCode = 500;
            statusMessage = 'Error al insertar el usuario en base de datos';
            nErrores++;
        }

    }

    // Cerramos la conexion mysql
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            console.log(`Error al cerrar la conexion con mysql. ${err}`);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }

    // Devolvemos la respuesta
    if (nErrores == 0) {
        statusMessage = `Registro realizado correctamente para el usuario ${username}`
        console.log(statusMessage)
        res.status(200)
            .json({
                result: 1,
                mensaje: statusMessage,
                usuario: { username: username, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, role: "alumno" }
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).json({
            result: 0,
            mensaje: statusMessage || 'General Error'});
    }

}

const registerTutor = async function (req, res) {
    let username = '';
    let password = '';
    let confirmPassword = '';
    let nombre = '';
    let apellidos = '';
    let email = '';
    let universidad = '';
    let grado = '';
    let descripcion = '';
    let userExiste = {};
    let user = {};
    let result = {};
    let hashPass = '';
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';

    let conexionMysql = {};
    let existeConexionMysql = false;

    let configuracion = parametros.configuracion();

    if (req.body) {
        if (req.body.username) {
            username = req.body.username;
        }
        if (req.body.password) {
            password = req.body.password;
        }
        if (req.body.confirmPassword) {
            confirmPassword = req.body.confirmPassword;
        }
        if (req.body.nombre) {
            nombre = req.body.nombre;
        }
        if (req.body.apellidos) {
            apellidos = req.body.apellidos;
        }
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.universidad) {
            universidad = req.body.universidad;
        }
        if (req.body.grado) {
            grado = req.body.grado;
        }
        if (req.body.descripcion) {
            descripcion = req.body.descripcion;
        }

    }

    if (!username) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un nombre de usuario';
        nErrores++;
    }
    if (!password) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una contraseña';
        nErrores++;
    }
    if (!confirmPassword) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una contraseña de confirmacion';
        nErrores++;
    }
    if (!nombre) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un nombre';
        nErrores++;
    }
    if (!apellidos) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado unos apellidos';
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un email';
        nErrores++;
    }
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un email válido';
        nErrores++;
    }
    if (!universidad) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una universidad';
        nErrores++;
    }
    if (!grado) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado un grado';
        nErrores++;
    }
    if (!descripcion) {
        statusCode = 400;
        statusMessage = 'No se ha proporcionado una descripcion';
        nErrores++;
    }

//=======

    let configuracion = parametros.configuracion();

    if (req.params.id) {
        idUsuario = req.params.id
        console.log(`Obteniendo información del usuario con id ${idUsuario}`)
    } else {
        console.log('No se ha definido el id del usuario.');
        statusCode = 500;
        statusMessage = 'General error';
        nErrores++;
    }
//>>>>>>> develop-v2

    //creo la conexion a la base de datos mysql
    if (nErrores == 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);

            existeConexionMysql = true;
        } catch (err) {
            console.log('Error al crear la conexion con mysql. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }


    if (nErrores == 0) {
        // Compruebo que no existe un usuario con el username
        try {
            userExiste = await mysqlUser.getByUsername(conexionMysql, username)
            if (userExiste) {
                statusCode = 200;
                statusMessage = 'Este nombre de usuario ya existe';
                nErrores++;
            }
            else {
                // Comprobamos que no existe un usuario con el email
                try {
                    userExiste = await mysqlUser.getByEmail(conexionMysql, email)
                    if (userExiste) {
                        statusCode = 200;
                        statusMessage = 'Este email ya existe';
                        nErrores++;
                    }
                    else {
                        // Comprobamos que las contraseñas coinciden
                        if (password != confirmPassword) {
                            statusCode = 200;
                            statusMessage = 'Las contraseñas deben coincidir';
                            nErrores++;
                        }
                    }
                }
                catch (err) {
                    console.log(`Error al obtener el email ${email}.`);
                    statusCode = 500;
                    statusMessage = 'Invalid Email';
                    nErrores++;
                }
            }
        }
        catch (err) {
            console.log(`Error al obtener el usuario ${username}.`);
            statusCode = 500;
            statusMessage = 'Invalid Username';

    // Recupero el usuario de la BD
    if (nErrores == 0) {
        try {
            user = await mysqlUser.getById(conexionMysql, idUsuario)
            if (user) {
                result.username = user.username;
                result.nombre = user.nombre;
                result.apellidos = user.apellidos;
                result.email = user.email;
                result.universidad = user.universidad;
                result.grado = user.grado;
                result.descripcion = user.descripcion;
                result.role = user.role;
            } else {
                statusCode = 404;
                statusMessage = 'No se ha encontrado el usuario con id ' + idUsuario;
                nErrores++;
            }
        }
        catch (err) {
            console.log(`Error al obtener el usuario ${idUsuario}.`);
            statusCode = 500;
            statusMessage = 'Invalid ID';
            nErrores++;
        }
    }


    // Continuamos si no existen dichos datos ya
    if (nErrores == 0) {
        hashPass = await utils.createHashPassword(password);
        user = { username: username, password: hashPass, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: descripcion, idRole: constants.ID_ROLE_TUTOR }
        console.log(user)
        // Introducimos en mysql el usuario con role de alumno
        try {
            result = await mysqlUser.saveUsuario(conexionMysql, user);
        }
        catch (err) {
            console.log(`Error al insertar el usuario en base de datos.`);
            statusCode = 500;
            statusMessage = 'Error al insertar el usuario en base de datos';
            nErrores++;
        }

    }

    // Cerramos la conexion mysql
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            console.log(`Error al cerrar la conexion con mysql. ${err}`);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }

    // Cerramos la conexion mysql
    if (conexionMysql) {
        await mysqlConnection.cerrarConexion(conexionMysql);

    }

    // Devolvemos la respuesta
    if (nErrores == 0) {
        statusMessage = `Registro realizado correctamente para el usuario ${username}`
        console.log(statusMessage)
        res.status(200)
            .json({
                result: 1,
                mensaje: statusMessage,
                usuario: { username: username, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: descripcion, role: "tutor" }
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).json({
            result: 0,
            mensaje: statusMessage || 'General Error'});
    }


        console.log(`Se ha obtenido el usuario ${idUsuario} correctamente`)
        res.status(200)
            .json(result);
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

module.exports = {
    login,
    registerAlumno,
    registerTutor,
    getUsuarioById
}
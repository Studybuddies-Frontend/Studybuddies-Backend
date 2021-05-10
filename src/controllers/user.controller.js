const bcrypt = require("bcryptjs")
const parametros = require("../lib/configParameters")
const constants = require("../lib/constants")
const utils = require("../lib/utils")

const mysqlConnection = require("../databases/mysql/repository/mysqldbManager");
const mysqlUser = require("../databases/mysql/models/user.model")

const mongodbConnection = require("../databases/mongodb/repository/mongodbManager");
const mongodbRoom = require("../databases/mongodb/models/rooms.model");

const login = async function (req, res) {
    let username = "";
    let password = "";
    let role = "";
    let user = {};
    let result = {};
    let nErrores = 0;
    let validPass = false;
    let statusCode = 0;
    let statusMessage = "";
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
        statusMessage = "Username not found";
        nErrores++;
    }
    if (!password) {
        statusCode = 404;
        statusMessage = "Password not found";
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
            existeConexionMysql = true
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    // Recupero el usuario de la BD
    if (nErrores === 0) {
        try {
            user = await mysqlUser.getByUsername(conexionMysql, username)
            if (!user) {
                statusCode = 401;
                statusMessage = "Invalid Credentials";
                nErrores++;
            }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid Username";
            nErrores++;
        }
    }

    // Comprobamos que la contraseña coincide
    if (nErrores === 0) {
        role = user.role
        id = user.id
        puntos = user.puntos
        validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
            statusCode = 401;
            statusMessage = "Invalid Credentials";
            nErrores++;
        }
        else {
            result.username = username;
            result.role = role;
            result.id = id;
            result.puntos = puntos;
        }
    }

    // Cerramos la conexion mysql
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    // Devolvemos la respuesta
    if (nErrores === 0) {
        res.status(200)
            .json(result);
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }

}

const getUsuarioById = async function (req, res) {
    let idUsuario = 0;
    let user = {};
    let result = {};
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";

    let conexionMysql = {};

    let configuracion = parametros.configuracion();

    if (req.params.id) {
        idUsuario = req.params.idRole;
    } else {
        statusCode = 500;
        statusMessage = "General error";
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    // Recupero el usuario de la BD
    if (nErrores === 0) {
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
                result.telefono = user.telefono;
                result.role = user.role;
            } else {
                statusCode = 404;
                statusMessage = "No se ha encontrado el usuario con id " + idUsuario;
                nErrores++;
            }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid ID";
            nErrores++;
        }
    }

    // Cerramos la conexion mysql
    if (conexionMysql) {
        await mysqlConnection.cerrarConexion(conexionMysql);
    }

    // Devolvemos la respuesta
    if (nErrores === 0) {
        res.status(200)
            .json(result);
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}

const getTutores = async function (req, res) {
    let idRole = 3;
    let users = [];
    let result = [];
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";

    let conexionMysql = {};

    let configuracion = parametros.configuracion();

    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    // Recupero el usuario de la BD
    if (nErrores === 0) {
        try {
            users = await mysqlUser.getByRole(conexionMysql, idRole)
            if (users) {
                for(var i=0;i<users.length;i++) {
                    let user ={};
                    user.id = users[i].id;
                    user.username = users[i].username;
                    user.nombre = users[i].nombre;
                    user.apellidos = users[i].apellidos;
                    user.email = users[i].email;
                    user.universidad = users[i].universidad;
                    user.grado = users[i].grado;
                    user.descripcion = users[i].descripcion;
                    user.role = users[i].role;
                    result.push(user);
                }
            } else {
                statusCode = 404;
                statusMessage = "No se ha encontrado ningun tutor ";
                nErrores++;
            }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid Role ID";
            nErrores++;
        }
    }

    // Cerramos la conexion mysql
    if (conexionMysql) {
        await mysqlConnection.cerrarConexion(conexionMysql);
    }

    // Devolvemos la respuesta
    if (nErrores === 0) {
        res.status(200)
            .json({tutores: result});
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}


const registerAlumno = async function (req, res) {
    let username = "";
    let password = "";
    let confirmPassword = "";
    let nombre = "";
    let apellidos = "";
    let email = "";
    let universidad = "";
    let grado = "";
    let userExiste = {};
    let user = {};
    let result = {};
    let hashPass = "";

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";

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
    }

    if (!username) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un nombre de usuario";
        nErrores++;
    }
    if (!password) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una contraseña";
        nErrores++;
    }
    if (!confirmPassword) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una contraseña de confirmacion";
        nErrores++;
    }
    if (!nombre) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un nombre";
        nErrores++;
    }
    if (!apellidos) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado unos apellidos";
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email";
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email";
        nErrores++;
    }
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email válido";
        nErrores++;
    }
    if (!universidad) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una universidad";
        nErrores++;
    }
    if (!grado) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un grado";
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
            existeConexionMysql = true;
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    if (nErrores === 0) {
        // Compruebo que no existe un usuario con el username
        try {
            userExiste = await mysqlUser.getByUsername(conexionMysql, username)
            if (userExiste) {
                statusCode = 200;
                statusMessage = "Este nombre de usuario ya existe";
                nErrores++;
            }
            else {
                // Comprobamos que no existe un usuario con el email
                try {
                    userExiste = await mysqlUser.getByEmail(conexionMysql, email)
                    if (userExiste) {
                        statusCode = 200;
                        statusMessage = "Este email ya existe";
                        nErrores++;
                    }
                    else {
                        // Comprobamos que las contraseñas coinciden
                        if (password != confirmPassword) {
                            statusCode = 200;
                            statusMessage = "Las contraseñas deben coincidir";
                            nErrores++;
                        }
                    }
                }
                catch (err) {
                    statusCode = 500;
                    statusMessage = "Invalid Email, error trying to connect to the db";
                    nErrores++;
                }
            }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid Username, error trying to connect to the db";
            nErrores++;
        }
    }

    // Continuamos si no existen dichos datos ya
    if (nErrores === 0) {
        hashPass = await utils.createHashPassword(password);
        user = { username: username, password: hashPass, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: null, telefono: null, idRole: constants.ID_ROLE_ALUMNO }
        // Introducimos en mysql el usuario con role de alumno
        try {
            result = await mysqlUser.saveUsuario(conexionMysql, user);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Error al insertar el usuario en base de datos";
            nErrores++;
        }

    }

    // Cerramos la conexion mysql
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    // Devolvemos la respuesta
    if (nErrores === 0) {
        statusMessage = `Registro realizado correctamente para el usuario ${username}`
        res.status(200)
            .json({
                result: 1,
                mensaje: statusMessage,
                usuario: {result}
            });
    } else {
        res.status(statusCode || 500).json({
            result: 0,
            mensaje: statusMessage || "General Error"
        });
    }

}

const registerTutor = async function (req, res) {
    let username = "";
    let password = "";
    let confirmPassword = "";
    let nombre = "";
    let apellidos = "";
    let email = "";
    let universidad = "";
    let grado = "";
    let descripcion = "";
    let telefono = "";
    let userExiste = {};
    let user = {};
    let result = {};
    let hashPass = "";
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";

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
        if (req.body.telefono) {
            telefono = req.body.telefono;
        }

    }

    if (!username) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un nombre de usuario";
        nErrores++;
    }
    if (!password) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una contraseña";
        nErrores++;
    }
    if (!confirmPassword) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una contraseña de confirmacion";
        nErrores++;
    }
    if (!nombre) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un nombre";
        nErrores++;
    }
    if (!apellidos) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado unos apellidos";
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email";
        nErrores++;
    }
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email válido";
        nErrores++;
    }
    if (!universidad) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una universidad";
        nErrores++;
    }
    if (!grado) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un grado";
        nErrores++;
    }
    if (!descripcion) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una descripcion";
        nErrores++;
    }
    //if (!telefono.match(/^[-\s./0-9]*$/)) {
    //    statusCode = 400;
    //    statusMessage = "No se ha proporcionado un telefono válido";
    //    nErrores++;
    //}

    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
            existeConexionMysql = true;
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }


    if (nErrores === 0) {
        // Compruebo que no existe un usuario con el username
        try {
            userExiste = await mysqlUser.getByUsername(conexionMysql, username)
            if (userExiste) {
                statusCode = 200;
                statusMessage = "Este nombre de usuario ya existe";
                nErrores++;
            }
            else {
                // Comprobamos que no existe un usuario con el email
                try {
                    userExiste = await mysqlUser.getByEmail(conexionMysql, email)
                    if (userExiste) {
                        statusCode = 200;
                        statusMessage = "Este email ya existe";
                        nErrores++;
                    }
                    else {
                        // Comprobamos que las contraseñas coinciden
                        if (password != confirmPassword) {
                            statusCode = 200;
                            statusMessage = "Las contraseñas deben coincidir";
                            nErrores++;
                        }
                    }
                }
                catch (err) {
                    statusCode = 500;
                    statusMessage = "Invalid Email";
                    nErrores++;
                }
            }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid Username";
        }
    }

    // Continuamos si no existen dichos datos ya
    if (nErrores === 0) {
        hashPass = await utils.createHashPassword(password);
        user = { username: username, password: hashPass, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: descripcion, telefono: telefono, idRole: constants.ID_ROLE_TUTOR }
        // Introducimos en mysql el usuario con role de tutor
        try {
            result = await mysqlUser.saveUsuario(conexionMysql, user);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Error al insertar el usuario en base de datos";
            nErrores++;
        }

    }

    // Cerramos la conexion mysql
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }



    // Devolvemos la respuesta
    if (nErrores === 0) {
        statusMessage = `Registro realizado correctamente para el usuario ${username}`
        res.status(200)
            .json({
                result: 1,
                mensaje: statusMessage,
                usuario: { result }
            });
    } else {
        res.status(statusCode || 500).json({
            result: 0,
            mensaje: statusMessage || "General Error"
        });
    }

}

const transformAlumnoToTutor = async function (req, res) {
        let descripcion = "";
        let telefono = "";
        let id = 0;
        let result = {};
        let nErrores = 0;
        let statusCode = 0;
        let statusMessage = "";
    
        let conexionMysql = {};
        let existeConexionMysql = false;
    
        let configuracion = parametros.configuracion();
    
        if (req.body) {
            if (req.body.descripcion) {
                descripcion = req.body.descripcion;
            }

            if (req.body.telefono) {
                telefono = req.body.telefono;
            }
        }
        

        if (!descripcion) {
            statusCode = 400;
            statusMessage = "No se ha proporcionado una descripcion";
            nErrores++;
        }
        /* if (!telefono) {
            statusCode = 400;
            statusMessage = "No se ha proporcionado una telefono";
            nErrores++;
        } */

        if (req.params.id) {
            id = req.params.id;
        } else {
            statusCode = 500;
            statusMessage = "General error";
            nErrores++;
        }
    
        //creo la conexion a la base de datos mysql
        if (nErrores === 0) {
            try {
                conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
                existeConexionMysql = true;
            } catch (err) {
                statusCode = 500;
                statusMessage = "Connection error";
                nErrores++;
            }
        }
    
        // Continuo si no hay errores
        if (nErrores === 0) {
            try {
                result = await mysqlUser.transformUsuario(conexionMysql, id, descripcion, telefono);
            }
            catch (err) {
                statusCode = 500;
                statusMessage = "Error al actualizar el usuario en base de datos";
                nErrores++;
            }
    
        }
    
        // Cerramos la conexion mysql
        if (existeConexionMysql) {
            try {
                await mysqlConnection.cerrarConexion(conexionMysql);
            }
            catch (err) {
                statusCode = 500;
                statusMessage = "Connection error";
                nErrores++;
            }
        }
    
    
    
        // Devolvemos la respuesta
        if (nErrores === 0) {
            statusMessage = `Se ha actualizado correctamente el rol del usuario`;
            res.status(200)
                .json({
                    result: 1,
                    mensaje: statusMessage,
                });
        } else {
            res.status(statusCode || 500).json({
                result: 0,
                mensaje: statusMessage || "General Error"
            });
        }    
}

const getMisTutores = async function (req, res) {
    let id = req.params.id;
    let idTutores = [];
    let tutores = [];
    let tutorias = {};
    let tutor = {};
    let tutor_filtrado = {};
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let configuracion = parametros.configuracion();
    let conexionMongodb = {};
    let conexionMysql = {};

    //Conexión a MongoDB
    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }
    //Rescato de MongoDB las tutorias que este alumno ha pagado
    if (nErrores === 0) {
        try {
            tutorias = await new mongodbRoom.getHistoricoTutorias(conexionMongodb, id);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }


    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (tutorias) {
        for(var i=0;i<tutorias.length;i++) {
            idTutores.push(tutorias[i].id_user);
        }
    }
    //Convierto los IDs de los tutores de todas las tutorias en una lista de ids unicos, para evitar repeticiones
    var uniq = [ ...new Set(idTutores) ]
    
    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }    
    
     // Recupero los datos de los usuarios de la base de datos
     if (nErrores === 0) {
        try {
        for(var i=0;i<uniq.length;i++) {
            tutor = await mysqlUser.getById(conexionMysql, uniq[i]);
            delete tutor["password"];
            delete tutor["puntos"];
            delete tutor["username"];
            delete tutor["role"];
            tutores.push(tutor);
        }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid user ID";
            nErrores++;
        }
    }  
        // Cerramos la conexion mysql
            try {
                await mysqlConnection.cerrarConexion(conexionMysql);
            }
            catch (err) {
                statusCode = 500;
                statusMessage = "Connection error";
                nErrores++;
            }
    //Devuelvo el json
    if (nErrores === 0) {
        res.status(200)
            .json({
                tutores: tutores
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}
}


const updateUser = async function (req, res) {
    let username = "";
    let nombre = "";
    let apellidos = "";
    let email = "";
    let universidad = "";
    let grado = "";
    let descripcion = "";
    let userExiste = {};
    let usuarioActual = {};
    let telefono = "";
    let user = {};
    let result = {};
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";

    let conexionMysql = {};
    let existeConexionMysql = false;

    let configuracion = parametros.configuracion();

    if (req.body) {
        if (req.body.username) {
            username = req.body.username;
        }
        if(req.body.id){
            id = req.body.id;
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
        if(req.body.telefono){
            telefono = req.body.telefono;
        }

    }

    if (!username) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un nombre de usuario";
        nErrores++;
    }
    if (!nombre) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un nombre";
        nErrores++;
    }
    if (!apellidos) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado unos apellidos";
        nErrores++;
    }
    if (!email) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email";
        nErrores++;
    }
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un email válido";
        nErrores++;
    }
    if (!universidad) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado una universidad";
        nErrores++;
    }
    if (!grado) {
        statusCode = 400;
        statusMessage = "No se ha proporcionado un grado";
        nErrores++;
    }


    //creo la conexion a la base de datos mysql
    if (nErrores === 0) {
        try {
            conexionMysql = await mysqlConnection.crearConexion(configuracion.mysqlConf.host, configuracion.mysqlConf.port, configuracion.mysqlConf.username, configuracion.mysqlConf.password, configuracion.mysqlConf.name);

            existeConexionMysql = true;
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }



    if (nErrores === 0){
        try{
            usuarioActual = await mysqlUser.getById(conexionMysql, id);
        }  catch (err) {
            statusCode = 500;
            statusMessage = "Invalid Id";
        }
    }

    if (nErrores === 0) {
        // Compruebo que no existe un usuario con el username
        try {
            userExiste = await mysqlUser.getByUsername(conexionMysql, username)
            if (userExiste && userExiste.id != usuarioActual.id) {
                statusCode = 200;
                statusMessage = "Este nombre de usuario ya existe";
                nErrores++;
            }
            else {
                // Comprobamos que no existe un usuario con el email
                try {
                    userExiste = await mysqlUser.getByEmail(conexionMysql, email)
                    if (userExiste && userExiste.id != usuarioActual.id) {
                        statusCode = 200;
                        statusMessage = "Este email ya existe";
                        nErrores++;
                    }
                }
                catch (err) {
                    statusCode = 500;
                    statusMessage = "Invalid Email";
                    nErrores++;
                }
            }
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Invalid Username";
        }
    }

    // Continuamos si no existen dichos datos ya
    if (nErrores === 0) {
        user = { username: username, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: descripcion,telefono: telefono, id: id}
        // Introducimos en mysql el usuario con role de alumno
        try {
            result = await mysqlUser.updateUsuario(conexionMysql, user);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Error al editar el usuario en base de datos";
            nErrores++;
        }

    }

    // Cerramos la conexion mysql
    if (existeConexionMysql) {
        try {
            await mysqlConnection.cerrarConexion(conexionMysql);
        }
        catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }



    // Devolvemos la respuesta
    if (nErrores === 0) {
        statusMessage = `Edición realizado correctamente para el usuario`;
        res.status(200)
            .json({
                result: 1,
                mensaje: statusMessage,
                usuario: { username: username, nombre: nombre, apellidos: apellidos, email: email, universidad: universidad, grado: grado, descripcion: descripcion, role: "tutor" }
            });
    } else {
        res.status(statusCode || 500).json({
            result: 0,
            mensaje: statusMessage || "General Error"
        });
    }


}

module.exports = {
    login,
    registerAlumno,
    registerTutor,
    getUsuarioById,
    updateUser,
    getTutores,
    transformAlumnoToTutor,
    getMisTutores
}
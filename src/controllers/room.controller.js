const bcrypt = require('bcryptjs')
const parametros = require('../lib/configParameters')
const { v4: uuidv4 } = require("uuid");

const mongodbConnection = require('../databases/mongodb/repository/mongodbManager');
const mongodbRoom = require('../databases/mongodb/models/rooms.model');

const mysqlConnection = require('../databases/mysql/repository/mysqldbManager');
const mysqlUser = require('../databases/mysql/models/user.model')


const createRoom = async function (req, res) {
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';

    let description = "";
    let university = "";
    let degree = "";
    let subject = "";
    let starting_time = null;
    let ending_time = null;
    let price_per_hour = 0;
    let is_private = false;
    let date = "";
    let iTime = "";
    let fTime = "";
    let authorised_users = [];
    let id_user = "";

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();
    let actualDate = new Date();

    if (req.body) {
        if (req.body.description) {
            description = req.body.description;
        }
        if (req.body.university) {
            university = req.body.university;
        }
        if (req.body.degree) {
            degree = req.body.degree;
        }
        if (req.body.subject) {
            subject = req.body.subject;
        }
        if (req.body.starting_time) {
            starting_time = new Date(req.body.starting_time);
        }
        if (req.body.ending_time) {
            ending_time = new Date(req.body.ending_time);
        }
        if (starting_time.getFullYear < actualDate.getFullYear() || starting_time.getFullYear == actualDate.getFullYear() && starting_time.getMonth < actualDate.getMonth() + 1 || starting_time.getFullYear == actualDate.getFullYear() && starting_time.getMonth == actualDate.getMonth() + 1 && starting_time.getDate < actualDate.getDate()) {
            console.log('Error. No se puede crear una sala con hora de fin menor que la hora de inicio. ');
            statusCode = 400;
            statusMessage = 'Form error';
            nErrores++;
        }
        if (!((ending_time.getHours() > starting_time.getHours()) || (ending_time.getHours() == starting_time.getHours() && ending_time.getMinutes() >= starting_time.getMinutes()))) {
            console.log('Error. No se puede crear una sala con hora de fin menor que la hora de inicio. ');
            statusCode = 400;
            statusMessage = 'Form error';
            nErrores++;
        }
        if (req.body.price_per_hour) {
            price_per_hour = req.body.price_per_hour;
        }
        if (req.body.is_private) {
            is_private = req.body.is_private;
        }
        if (req.body.date) {
            date = req.body.date;
        }
        if (req.body.iTime) {
            iTime = req.body.iTime;
        }
        if (req.body.fTime) {
            fTime = req.body.fTime;
        }
        if (req.body.authorised_users) {
            authorised_users = req.body.authorised_users;
            if (!req.body.is_private && req.body.authorised_users.length != 0) {
                console.log('Error. No se puede crear una sala no privada y añadir gente autorizada. ');
                statusCode = 400;
                statusMessage = 'Form error';
                nErrores++;
            }
        }
        if (req.body.id_user) {
            id_user = req.body.id_user;
        }

    }


    // Generar room db
    let guid = uuidv4();
    let room_url = "meet.jit.si/studybuddies-" + guid


    //creo la conexion a la base de datos mongodb
    if (nErrores == 0) {
        try {
            conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
        } catch (err) {
            console.log('Error al crear la conexion con mongodb. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }


    if (nErrores == 0) {


        let room = new mongodbRoom.Room()
        room.guid = guid;
        room.description = description
        room.university = university;
        room.degree = degree;
        room.subject = subject;
        room.starting_time = starting_time;
        room.ending_time = ending_time;
        room.price_per_hour = price_per_hour;
        room.is_private = is_private;
        room.date = date;
        room.iTime = iTime;
        room.fTime = fTime;
        room.authorised_users = authorised_users;
        room.id_user = id_user;
        room.room_url = room_url;

        try {
            await mongodbRoom.guardarRoom(conexionMongodb, room, "rooms");
        } catch (err) {
            console.log(`Error al añadir la room para el usuario: ${id_user}` + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }
    // Cerramos la conexion mongo
    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    // Devolvemos la respuesta
    if (nErrores == 0) {
        console.log(`Room creada correctamente`);
        res.status(200).json({
            id_room: guid
        });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

const getAll = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';
    let allRoom = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }



    if (nErrores == 0) {
        try {
            allRoom = await new mongodbRoom.getRooms(conexionMongodb);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Salas obtenidas con éxito`)
        res.status(200)
            .json({
                allRoom: allRoom
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

const getSalasEstudioActivas = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';
    let salasEstudio = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }



    if (nErrores == 0) {
        try {
            salasEstudio = await new mongodbRoom.getSalasEstudioActivas(conexionMongodb);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Salas obtenidas con éxito`)
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const getTutoriasActivas = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';
    let tutorias = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }


    if (nErrores == 0) {
        try {
            tutorias = await new mongodbRoom.getTutoriasActivas(conexionMongodb);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Salas obtenidas con éxito`)
        res.status(200)
            .json({
                tutorias: tutorias
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const getMisSalas = async function (req, res) {

    let nErrores = 0;
    let salasEstudio = {};
    let id = req.params.id;

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }


    if (nErrores == 0) {
        try {
            salasEstudio = await new mongodbRoom.getMisSalas(conexionMongodb, id);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Mis salas obtenidas con éxito`)
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
        console.log("Ha dejado de funcionar")
    }
}

const getMisTutorias = async function (req, res) {

    let nErrores = 0;
    let tutorias = {};
    let id= req.params.id;

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }


    if (nErrores == 0) {
        try {
            tutorias = await new mongodbRoom.getMisTutorias(conexionMongodb, id);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Mis Tutorías obtenidas con éxito`)
        res.status(200)
            .json({
                tutorias: tutorias
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
        console.log("Ha dejado de funcionar")
    }
}


const getMisTutoriasPagadas = async function (req, res) {

    let nErrores = 0;
    let salasEstudio = {};
    let id = req.params.id;

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }


    if (nErrores == 0) {
        try {
            salasEstudio = await new mongodbRoom.getMisTutoriasPagadas(conexionMongodb, id);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Mis tutorias pagadas obtenidas con éxito`)
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const getById = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';
    let room = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }



    if (nErrores == 0) {
        try {
            room = await new mongodbRoom.getRoomById(conexionMongodb, req.params.guid);
            if (!room) {
                statusCode = 401;
                statusMessage = 'Invalid Credentials';
                nErrores++;
            }
        }
        catch (err) {
            console.log(`Error al obtener la sala.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Sala obtenida con éxito`)
        res.status(200)
            .json({
                room: room
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const anadirAutorizados = async function (req, res) {
    console.log("intento coger la sala")
    let nErrores = 0;
    let room = {};
    let free = false;
    let user = null;
    let authorised_users = [];
    let puntos = 0;

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    //Creo la conexon con la base de datos de mongo
    console.log("creo la connexion con mongo")
    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }

    //creo la conexion a la base de datos mysql
    console.log("creo la connexion con mysql")
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

    if(req.body.free){
        free = req.body.free;
    }

    if(req.body.id_user){
        try {
            user = await mysqlUser.getById(conexionMysql, req.body.id_user)
            console.log("puntos : \n" + user.puntos)
        }
        catch (err) {
            statusCode = 404;
            statusMessage = 'No se ha encontrado el usuario con id ' + usuariosAutorizados[i];
            nErrores++;
        }
    }
    console.log(req.body)
    console.log("intento coger la sala")
    if (nErrores == 0) {
        try {
            console.log("coger la sala");
            room = await new mongodbRoom.getRoomById(conexionMongodb, req.body.guid);
            console.log("sala: \n" + room);
        }
        catch (err) {
            console.log(`Error al obtener la sala.`);
            statusCode = 500;
            nErrores++;
        }
        try{
            if (room[0].authorised_users.includes(req.body.id_user)) {
                statusCode = 423;
                statusMessage = "Este cliente ya ha pagado"
                nErrores++;
            } else if(free && user.puntos >= 10){
                room[0].authorised_users.push(req.body.id_user);
                await mongodbRoom.updateRoom(conexionMongodb, req.body.guid, room[0].authorised_users, "rooms");
                //quitarle al usuario 10 puntos
                puntos = user.puntos;
                puntos = puntos - 10;
                await mysqlUser.updatePuntosUsuario(conexionMysql, req.body.id_user, puntos);
            }else if(!free){
                room[0].authorised_users.push(req.body.id_user);
                await mongodbRoom.updateRoom(conexionMongodb, req.body.guid, room[0].authorised_users, "rooms");
                //sumarle al user 1 punto
                puntos = user.puntos;
                puntos = puntos + 1;
                await mysqlUser.updatePuntosUsuario(conexionMysql, req.body.id_user, puntos);
            }else {
                statusCode = 423;
                statusMessage = "Este cliente no tiene suficientes puntos para pagar la clase gratuita"
                nErrores++;
            }
        }catch(err){

        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
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

    if (nErrores == 0) {
        console.log(`Usuario autorizado con éxito`)
        res.status(200)
            .json({
                room: room
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const getSalasEstudioActivasById = async function (req, res) {

    let nErrores = 0;
    let salasEstudio = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }



    if (nErrores == 0) {
        try {
            salasEstudio = await new mongodbRoom.getSalasEstudioActivasById(conexionMongodb, req.params.guid);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Salas obtenidas con éxito`)
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const getTutoriasActivasById = async function (req, res) {

    let nErrores = 0;
    let tutorias = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }



    if (nErrores == 0) {
        try {
            tutorias = await new mongodbRoom.getTutoriasActivasById(conexionMongodb, req.params.guid);
        }
        catch (err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Salas obtenidas con éxito`)
        res.status(200)
            .json({
                tutorias: tutorias
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }
}

const getAsignaturasByTutor = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';
    let asignaturas = [];

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }

    if (nErrores == 0) {
        try {
            asignaturas = await new mongodbRoom.getAsignaturasByTutor(conexionMongodb, req.params.idTutor);
            if (!asignaturas) {
                statusCode = 404;
                statusMessage = 'No se han encontrado tutorías del tutor ' + req.params.idTutor;
                nErrores++;
            }
        }
        catch (err) {
            console.log(`Error al obtener las asignaturas.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Asignaturas del tutor obtenidas con éxito`)
        res.status(200)
            .json({
                asignaturas: asignaturas
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

const getUsuariosByTutoria = async function (req, res) {
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';
    let room = null;
    let usuariosAutorizados = [];
    let user = null;
    let usuarios = [];

    let conexionMongodb = {};
    let conexionMysql = {};
    let existeConexionMysql = false;

    let configuracion = parametros.configuracion();

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

    if (nErrores == 0) {
        try {
            conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
        } catch (err) {
            console.log('Error al crear la conexion con mongodb. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }

    if (nErrores == 0) {
        try {
            room = await mongodbRoom.getRoomById(conexionMongodb, req.params.guid);
            if (!room) {
                statusCode = 404;
                statusMessage = 'Id incorrecto';
                nErrores++;
            }
            else {
                usuariosAutorizados = room[0].authorised_users;
                console.log(usuariosAutorizados)
            }
        }
        catch (err) {
            console.log(`Error al obtener la sala.`);
            statusCode = 500;
            nErrores++;
        }
    }

    if (nErrores == 0) {
        if (Array.isArray(usuariosAutorizados) && usuariosAutorizados.length > 0) {
            for (var i=0; i < usuariosAutorizados.length; i++) {
                let datosUsuario = {};
                try {
                    user = await mysqlUser.getById(conexionMysql, usuariosAutorizados[i])
                    if (user) {
                        datosUsuario.username = user.username;
                        datosUsuario.email = user.email;

                        usuarios.push(datosUsuario)
                    }
                }
                catch (err) {
                    statusCode = 404;
                    statusMessage = 'No se ha encontrado el usuario con id ' + usuariosAutorizados[i];
                    nErrores++;
                }
            }
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

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Usuarios autorizados obtenidos con exito`)
        res.status(200)
            .json({
                usuarios_autorizados: usuarios
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

module.exports = {
    createRoom,
    getAll,
    getById,
    getSalasEstudioActivas,
    getTutoriasActivas,
    getMisSalas,
    getMisTutorias,
    getMisTutoriasPagadas,
    getAsignaturasByTutor,
    anadirAutorizados,
    getSalasEstudioActivasById,
    getTutoriasActivasById,
    getUsuariosByTutoria
}

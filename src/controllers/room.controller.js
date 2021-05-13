const bcrypt = require("bcryptjs")
const parametros = require("../lib/configParameters")
const { v4: uuidv4 } = require("uuid");

const mongodbConnection = require("../databases/mongodb/repository/mongodbManager");
const mongodbRoom = require("../databases/mongodb/models/rooms.model");

const mysqlConnection = require("../databases/mysql/repository/mysqldbManager");
const mysqlUser = require("../databases/mysql/models/user.model")

const comisionTutorias = 0.5


const createRoom = async function (req, res) {
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";

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
            statusCode = 400;
            statusMessage = "Form error";
            nErrores++;
        }
        if (!((ending_time.getHours() > starting_time.getHours()) || (ending_time.getHours() == starting_time.getHours() && ending_time.getMinutes() >= starting_time.getMinutes()))) {
            statusCode = 400;
            statusMessage = "Form error";
            nErrores++;
        }
        if (req.body.price_per_hour) {
            price_per_hour = req.body.price_per_hour;
        }
        if (req.body.is_private) {
            is_private = req.body.is_private;
        }
        if (is_private==true && (Math.abs(ending_time - starting_time) / 36e5) < 1) {
            statusCode = 400;
            statusMessage = "No se puede crear una tutoria de duracion menor a una hora";
            nErrores++;
        }
        if (is_private==true && (Math.abs(ending_time - starting_time) / 36e5) > 5) {
            statusCode = 400;
            statusMessage = "No se puede crear una tutoria de duracion mayor a cinco";
            nErrores++;
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
                statusCode = 400;
                statusMessage = "Form error";
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
    if (nErrores === 0) {
        try {
            conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }


    if (nErrores === 0) {

        let precioTotal = "";
        let tiempoTotal = Math.abs(ending_time - starting_time) / 36e5;
        if(price_per_hour) {
            precioTotal = (price_per_hour * tiempoTotal).toFixed(2);
            //Calculamos las comisiones para el precio total
            let comisionTotalTutoria = (comisionTutorias * tiempoTotal).toFixed(2);
            //Añadimos las comisiones:
            room.price_per_hour = room.price_per_hour + comisionTutorias;
            room.precio_total = room.precio_total + comisionTotalTutoria;
        }
        let tiempoParse = (tiempoTotal.toFixed(2)).toString().split(".")
        let horasMin = tiempoParse[0].toString() + "." + Math.round(tiempoParse[1] /100 * 60).toString()
        let room = new mongodbRoom.Room()
        room.guid = guid;
        room.description = description
        room.university = university;
        room.degree = degree;
        room.subject = subject;
        room.starting_time = starting_time;
        room.ending_time = ending_time;
        room.price_per_hour = price_per_hour;
        room.precio_total = parseFloat(precioTotal);
        room.is_private = is_private;
        room.date = date;
        room.iTime = iTime;
        room.fTime = fTime;
        room.tiempo_total = horasMin;
        room.authorised_users = authorised_users;
        room.id_user = id_user;
        room.room_url = room_url;

        try {
            await mongodbRoom.guardarRoom(conexionMongodb, room, "rooms");
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }
    // Cerramos la conexion mongo
    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    // Devolvemos la respuesta
    if (nErrores === 0) {
        res.status(200).json({
            id_room: guid
        });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }

}

const getAll = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let allRoom = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }



    if (nErrores === 0) {
        try {
            allRoom = await new mongodbRoom.getRooms(conexionMongodb);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                allRoom: allRoom
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }

}

const getSalasEstudioActivas = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let salasEstudio = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }



    if (nErrores === 0) {
        try {
            salasEstudio = await new mongodbRoom.getSalasEstudioActivas(conexionMongodb);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}

const getTutoriasActivas = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let tutorias = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }


    if (nErrores === 0) {
        try {
            tutorias = await new mongodbRoom.getTutoriasActivas(conexionMongodb);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                tutorias: tutorias
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
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
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }


    if (nErrores === 0) {
        try {
            salasEstudio = await new mongodbRoom.getMisSalas(conexionMongodb, id);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
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
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }


    if (nErrores === 0) {
        try {
            tutorias = await new mongodbRoom.getMisTutorias(conexionMongodb, id);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                tutorias: tutorias
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
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
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }


    if (nErrores === 0) {
        try {
            salasEstudio = await new mongodbRoom.getMisTutoriasPagadas(conexionMongodb, id);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}

const getById = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let room = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }



    if (nErrores === 0) {
        try {
            room = await new mongodbRoom.getRoomById(conexionMongodb, req.params.guid);
            if (!room[0]) {
                statusCode = 401;
                statusMessage = "La fecha límite de la sala ha expirado o la sala no existe";
                nErrores++;
            }
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                room: room
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}

const anadirAutorizados = async function (req, res) {
    let nErrores = 0;
    let room = {};
    let free = false;
    let user = null;
    let authorised_users = [];
    let puntos = 0;

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    //Creo la conexon con la base de datos de mongo
    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
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

    if(req.body.free){
        free = req.body.free;
    }

    if(req.body.id_user){
        try {
            user = await mysqlUser.getById(conexionMysql, req.body.id_user)
        }
        catch (err) {
            statusCode = 404;
            statusMessage = "No se ha encontrado el usuario con id " + usuariosAutorizados[i];
            nErrores++;
        }
    }

    if (nErrores === 0) {
        try {
            room = await new mongodbRoom.getRoomById(conexionMongodb, req.body.guid);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
        try{
            if (room[0].authorised_users.includes(req.body.id_user)) {
                statusCode = 423;
                statusMessage = "Este cliente ya ha pagado"
                nErrores++;
            }else if(free && user.puntos >= 15){
                room[0].authorised_users.push(req.body.id_user);
                await mongodbRoom.updateRoom(conexionMongodb, req.body.guid, room[0].authorised_users, "rooms");
                //quitarle al usuario 15 puntos puesto que ha pagado con estos la clase
                puntos = user.puntos;
                puntos = puntos - 15;
                await mysqlUser.updatePuntosUsuario(conexionMysql, req.body.id_user, puntos);
            }else if(!free){
                room[0].authorised_users.push(req.body.id_user);
                await mongodbRoom.updateRoom(conexionMongodb, req.body.guid, room[0].authorised_users, "rooms");
                //sumarle al usuario 1 punto por haber pagado
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
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                room: room
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
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
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }



    if (nErrores === 0) {
        try {
            salasEstudio = await new mongodbRoom.getSalasEstudioActivasById(conexionMongodb, req.params.guid);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                salasEstudio: salasEstudio
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
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
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }



    if (nErrores === 0) {
        try {
            tutorias = await new mongodbRoom.getTutoriasActivasById(conexionMongodb, req.params.guid);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                tutorias: tutorias
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }
}

const getAsignaturasByTutor = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let asignaturas = [];

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }

    if (nErrores === 0) {
        try {
            asignaturas = await new mongodbRoom.getAsignaturasByTutor(conexionMongodb, req.params.idTutor);
            if (!asignaturas) {
                statusCode = 404;
                statusMessage = "No se han encontrado tutorías del tutor " + req.params.idTutor;
                nErrores++;
            }
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                asignaturas: asignaturas
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }

}

const getUsuariosByTutoria = async function (req, res) {
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let room = null;
    let usuariosAutorizados = [];
    let user = null;
    let usuarios = [];

    let conexionMongodb = {};
    let conexionMysql = {};
    let existeConexionMysql = false;

    let configuracion = parametros.configuracion();

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

    if (nErrores === 0) {
        try {
            conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
        } catch (err) {
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    if (nErrores === 0) {
        try {
            room = await mongodbRoom.getRoomById(conexionMongodb, req.params.guid);
            if (!room) {
                statusCode = 404;
                statusMessage = "Id incorrecto";
                nErrores++;
            }
            else {
                usuariosAutorizados = room[0].authorised_users;
            }
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (nErrores === 0) {
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
                    statusMessage = "No se ha encontrado el usuario con id " + usuariosAutorizados[i];
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
            statusCode = 500;
            statusMessage = "Connection error";
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200)
            .json({
                usuarios_autorizados: usuarios
            });
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
    }

}


const deleteRoom = async function (req, res) {

    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = "";
    let sala = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.host, configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        statusCode = 500;
        statusMessage = "Connection error";
        nErrores++;
    }

    if (nErrores === 0) {
        try {
         sala = await new mongodbRoom.getRoomByIdSinFecha(conexionMongodb, req.params.guid);
         if(sala[0].authorised_users.length > 0){
             statusCode = 400;
             statusMessage = "La tutoria tiene un usuario autorizado";
             nErrores++;
        }
    }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }


    if (nErrores === 0) {
        try {
          await new mongodbRoom.deleteRoom(conexionMongodb, req.params.guid);
        }
        catch (err) {
            statusCode = 500;
            nErrores++;
        }
    }

    if (conexionMongodb) {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores === 0) {
        res.status(200).send({Message: "Sala borrada con éxito"});
    } else {
        res.status(statusCode || 500).send(statusMessage || "General Error");
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
    getUsuariosByTutoria,
    deleteRoom
}

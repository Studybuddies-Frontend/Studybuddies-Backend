const bcrypt = require('bcryptjs')
const parametros = require('../lib/configParameters')
const mongodbManager =  require("mongoose");
const { v4: uuidv4 } = require("uuid");

const mongodbConnection = require('../databases/mongodb/repository/mongodbManager');
const mongodbRoom = require('../databases/mongodb/models/rooms.model')

// conectar a la bbdd
var mongoDB = "mongodb://127.0.0.1/studybuddies";


const createRoom = async function(req, res) {
    
    let nErrores = 0;
    let statusCode = 0;
    let statusMessage = '';

    let description = "";
    let university = "";
    let degree = "";
    let subject = "";
    let starting_time = new Date();
    let ending_time = new Date();
    let price_per_hour = 0;
    let is_private = false;
    let authorised_users = [];
    let id_user = "";

    let room_url;
    let domain = "";
    let options = {
        
    };

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    if(req.body) {
        if(req.body.description) {
            description = req.body.description;
        }
        if(req.body.university) {
            university = req.body.university;
        }
        if(req.body.degree) {
            degree = req.body.degree;
        }
        if(req.body.subject) {
            subject = req.body.subject;
        }
        if(req.body.starting_time) {
            starting_time = req.body.starting_time;
        }
        if(req.body.ending_time) {
            ending_time = req.body.ending_time;
        }
        if(req.body.price_per_hour) {
            price_per_hour = req.body.price_per_hour;
        }
        if(req.body.is_private) {
            is_private = req.body.is_private;
        }
        if(req.body.authorised_users) {
            authorised_users = req.body.authorised_users;
            if(!is_private && authorised_users.length!=0){
                console.log('Error. No se puede crear una sala no privada y añadir gente autorizada. ');
                statusCode = 400;
                statusMessage = 'Form error';
                nErrores++;
            }
        }
        if(req.body.id_user) {
            id_user = req.body.id_user;
        }

    }

    // Los datos vienen comprobados del front??

    // Generar room db
    const id = uuidv4();

    const roomBody = {
        guid : id,
        description: description,
        university : university,
        degree : degree,
        subject : subject,
        starting_time : starting_time,
        ending_time : ending_time,
        price_per_hour : price_per_hour,
        is_private : is_private,
        authorised_users : authorised_users,
        id_user : id_user,
        room_url : "meet.jit.si/studybuddies-"+id
        /*
        domain : "meet.jit.si",
        options : {
            roomName : "studybuddies-"+id,
            width : 700,
            height: 700,
            parentNode: "document.querySelector('#meet')"
        }
        */
    };

    //creo la conexion a la base de datos mongodb
    if (nErrores == 0) {
        try {
            conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
        } catch (err) {
            console.log('Error al crear la conexion con mongodb. ' + err);
            statusCode = 500;
            statusMessage = 'Connection error';
            nErrores++;
        }
    }


    try {
        await mongodbRoom.guardarRoom(conexionMongodb, roomBody, "rooms");
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }
    // Cerramos la conexion mongo
    if (nErrores == 0) 
    {
        await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    // Devolvemos la respuesta
    if (nErrores == 0) {
        console.log(`Room creada correctamente`);
        res.status(200).json({roomBody});
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }

}

const getAll = async function(req, res) {

    let nErrores = 0;
    let allRoom = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }

    let now = new Date();

    if(nErrores == 0) {
        try {
            allRoom = await new mongodbRoom.getRooms(conexionMongodb, now.getTime());
        }
        catch(err) {
            console.log(`Error al conectar con el servidor.`);
            statusCode = 500;
            nErrores++;
        }
    }
 
    if (nErrores == 0) 
    {
    await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Salas obtenidas con éxito`)
        res.status(200)
            .json({
                allRoom:allRoom
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }  

}

const getById = async function(req, res) {

    let nErrores = 0;
    let room = {};

    let conexionMongodb = {};

    let configuracion = parametros.configuracion();

    try {
        conexionMongodb = await mongodbConnection.crearConexion(configuracion.mongoConf.username, configuracion.mongoConf.password, configuracion.mongoConf.name);
    } catch (err) {
        console.log('Error al crear la conexion con mongodb. ' + err);
        statusCode = 500;
        statusMessage = 'Connection error';
        nErrores++;
    }

    let now = new Date();

    if(nErrores == 0) {
        try {
            room = await new mongodbRoom.getRoomById(conexionMongodb, now.getTime(), req.params.guid);
            if (!room) {
                statusCode = 401;
                statusMessage = 'Invalid Credentials';
                nErrores++;
            }
        }
        catch(err) {
            console.log(`Error al obtener la sala.`);
            statusCode = 500;
            nErrores++;
        }
    }
 
    if (nErrores == 0) 
    {
    await mongodbConnection.cerrarConexion(conexionMongodb);
    }

    if (nErrores == 0) {
        console.log(`Sala obtenida con éxito`)
        res.status(200)
            .json({
                room:room
            });
    } else {
        console.log(statusMessage);
        res.status(statusCode || 500).send(statusMessage || 'General Error');
    }  

}


module.exports = {
    createRoom,
    getAll,
    getById
}
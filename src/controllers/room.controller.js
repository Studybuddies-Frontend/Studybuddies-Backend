const bcrypt = require('bcryptjs')
const parametros = require('../lib/configParameters')
const mongoose =  require("mongoose");
const { v4: uuidv4 } = require("uuid");

const mongodbConnection = require('../databases/mongodb/repository/mongodbManager');
const mongodbRoom = require('../databases/mongodb/models/rooms.model')

// conectar a la bbdd
var mongoDB = "mongodb://127.0.0.1/studybuddies";
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

const create = async function(req, res) {
    
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
    let id_user = "";

    let room_url
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

    // Crear room en BBDD
    const room = await new mongodbRoom.room(roomBody);
    room.save();

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

module.exports = {
    create
}
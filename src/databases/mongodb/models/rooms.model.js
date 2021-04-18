const moment = require('moment')

class Room {
    constructor() {
        this.guid = '',
            this.description = '',
            this.university = '',
            this.degree = '',
            this.subject = '',
            this.starting_time = null,
            this.ending_time = null,
            this.price_per_hour = 0,
            this.is_private = null,
            this.date = '',
            this.iTime = '',
            this.fTime = '',
            this.authorised_users = [],
            this.id_user = 0,
            this.room_url = ''
    }
}

const guardarRoom = function (db, room, colRooms) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db("studybuddies").collection(colRooms)
            roomCollection.insertOne(room).then((result) => {
                resolve()
            })
                .catch((err) => {
                    reject(err)
                })
        }
        catch (err) {
            reject(err)
        }
    })
}

const getRooms = function (db) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = {}
            //if (fechaActual){
            //	query.fecha_fin = { $gte: fechaActual };
            //}
            const document = roomCollection.find().toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    }
    )
}

const getSalasEstudioActivas = function (db, fechaActual) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { is_private: false}
            let fechaActual = new Date();
            fechaActual.setHours( fechaActual.getHours() + 2 );
            let fecha = moment(fechaActual).format("YYYY-MM-DDThh:mm:ss");


            if (fecha){
            	query.ending_time =  {$gte: new Date(fecha)};
            }
            const document = roomCollection.find(query).toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    }
    )
}

const getTutoriasActivas = function (db, fechaActual) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { is_private: true}
            let fechaActual = new Date();
            fechaActual.setHours( fechaActual.getHours() + 2 );
            let fecha = moment(fechaActual).format("YYYY-MM-DDThh:mm:ss");


            if (fecha){
            	query.ending_time =  {$gte: new Date(fecha)};
            }

            const document = roomCollection.find(query).toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    })
}
const getMisSalas = function (db, id) {
    return new Promise((resolve, reject) => {
        try {
            const idNumber = parseInt(id)
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { id_user: idNumber};

            const document = roomCollection.find(query).toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    }
    )
}

const getMisTutorias = function (db, id) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const idNumber = parseInt(id);
            const query = {authorised_users: idNumber};
            console.log(query);

            const document = roomCollection.find(query).toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    }
    )
}

const getRoomById = function (db, guid) {
    return new Promise((resolve, reject) => {

        try {

            const roomCollection = db.db('studybuddies').collection('rooms');

            const query = {}


            let fechaActual = new Date();
            fechaActual.setHours( fechaActual.getHours() + 2 );
            let fecha = moment(fechaActual).format("YYYY-MM-DDThh:mm:ss");


            if (fecha){
            	query.ending_time =  {$gte: new Date(fecha)};
            }

            if (guid) {
                query.guid = guid;
            }
            const document = roomCollection.find(query).toArray(function (err, result) {

                if (err) {
                    reject(err)
                }


                resolve(result);

            });

        } catch (err) {

            reject(err);

        }

    }
    )

}

const updateRoom = function (db, idRoom, listaAutorizados, colRooms) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db("studybuddies").collection(colRooms)
            roomCollection.updateOne({ "guid": idRoom },
                { $set: { "authorised_users": listaAutorizados } }).then((result) => {
                    resolve()
                })
                .catch((err) => {
                    reject(err)
                })

        }
        catch (err) {
            reject(err)
        }
    })
}

const getSalasEstudioActivasById = function (db, fechaActual, guid) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { is_private: false, guid: guid }
            //if (fechaActual){
            //	query.fecha_fin = { $gte: fechaActual };
            //}


            const document = roomCollection.find(query).toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    }
    )
}

const getTutoriasActivasById = function (db, fechaActual, guid) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { is_private: true, guid: guid }
            //if (fechaActual){
            //	query.fecha_fin = { $gte: fechaActual };
            //}
            const document = roomCollection.find(query).toArray(function (err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    })
}

const getAsignaturasByTutor = function (db, idTutor) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { is_private: true };
            if (idTutor) {
                query.id_user = parseInt(idTutor)
            }
            console.log(query)
            const document = roomCollection.distinct('subject', query)
            resolve(document)
        } catch (err) {
            reject(err);
        }
    })
}


module.exports = {
    Room,
    guardarRoom,
    getRooms,
    getRoomById,
    getSalasEstudioActivas,
    getTutoriasActivas,
    getMisSalas,
    getMisTutorias,
    updateRoom,
    getSalasEstudioActivasById,
    getTutoriasActivasById,
    getAsignaturasByTutor
}
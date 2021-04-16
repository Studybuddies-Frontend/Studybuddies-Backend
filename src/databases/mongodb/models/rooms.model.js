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

const getRooms = function (db, fechaActual) {
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

const getTutoriasActivas = function (db, fechaActual) {
    return new Promise((resolve, reject) => {
        try {
            const roomCollection = db.db('studybuddies').collection('rooms');
            const query = { is_private: true}
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

const getRoomById = function (db, fechaActual, guid) {
    return new Promise((resolve, reject) => {

        try {

            const roomCollection = db.db('studybuddies').collection('rooms');

            const query = {}


            //if (fechaActual){
            //	query.fecha_fin = { $gte: fechaActual };
            //}
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

module.exports = {
    Room,
    guardarRoom,
    getRooms,
    getRoomById,
    getSalasEstudioActivas,
    getTutoriasActivas,
    getMisSalas,
    getMisTutorias
}
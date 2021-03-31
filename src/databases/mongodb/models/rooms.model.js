

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
        this.authorised_users = [],
        this.id_user = 0,
        this.room_url = ''
    }
}

const guardarRoom = function(db, room, colRooms) {
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
        catch(err) {
            reject(err)
        }
    })
}

const getRooms = function (db, dbName) {
    return new Promise((resolve, reject) => {
        try {
            const roomsCollection = db.db(dbName).collection('rooms')
            const document = roomsCollection.find().toArray(function (err, result) {
                if (err) reject(err)

                resolve(result)
            })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    Room,
    getRooms,
    guardarRoom
}
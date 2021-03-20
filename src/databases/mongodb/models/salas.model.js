class SalasDocument {
    constructor() {
        this.guid_sala = null
        this.tipo_sala = null
    }
}

const getSalas = function (db, dbName) {
    return new Promise((resolve, reject) => {
        try {
            const salasCollection = db.db(dbName).collection('salas')
            const document = salasCollection.find().toArray(function (err, result) {
                if (err) reject(err)

                resolve(result)
            })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    SalasDocument,
    getSalas
}
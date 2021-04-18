//Obtener usuarios por su USERNAME
const getByUsername = (db, username) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT u.id,
                            u.username,
                            u.password,
                            u.nombre,
                            u.apellidos,
                            u.email,
                            roles.rol as role
        FROM usuarios u INNER JOIN roles_usuario roles ON u.id_role = roles.id 
        WHERE u.username = ?`;

        db.query(query, [username], (err, rows) => {
            if (err) reject(err)
            resolve(rows[0])
        })
    })
}

const getById = (db, id) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT u.id,
                            u.username,
                            u.password,
                            u.nombre,
                            u.apellidos,
                            u.email,
                            u.universidad,
                            u.grado,
                            u.descripcion,
                            roles.rol as role
        FROM usuarios u INNER JOIN roles_usuario roles ON u.id_role = roles.id 
        WHERE u.id = ?`;

        db.query(query, [id], (err, rows) => {
            if (err) reject(err)
            resolve(rows[0])
        })
    })
}

module.exports = {
    getByUsername,
    getById
}
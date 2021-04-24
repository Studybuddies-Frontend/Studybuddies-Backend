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


const getByEmail = (db, email) => {
  return new Promise((resolve, reject) => {
        let query = `SELECT u.id,
                            u.username,
                            u.password,
                            u.nombre,
                            u.apellidos,
                            u.email,
                            roles.rol as role
        FROM usuarios u INNER JOIN roles_usuario roles ON u.id_role = roles.id 
        WHERE u.email = ?`;
        db.query(query, [email], (err, rows) => {
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


const saveUsuario = (db, {username, password, nombre, apellidos, email, universidad, grado, descripcion, idRole}) => {
    return new Promise((resolve, reject) => {
        let params = [username, password, nombre, apellidos, email, universidad, grado, descripcion, idRole];
        let query = 'INSERT INTO `usuarios`(`username`,`password`,`nombre`,`apellidos`,`email`,`universidad`,`grado`,`descripcion`,`id_role`) VALUES (?,?,?,?,?,?,?,?,?)'
        db.query(query, params, (err, result) => {
            if(err) {
                console.log(err)
                reject(err)
            }
            if(result) resolve(result)
        })
    })
}

const transformUsuario = (db, id) => {
    return new Promise((resolve, reject) => {
        //TODO comprobar que esta query funciona bien
        let query = 'UPDATE `usuarios` SET id_role=3 WHERE id = ?'
        db.query(query, params, (err, result) => {
            if(err) {
                console.log(err)
                reject(err)
            }
            if(result) resolve(result)
        })
    })
}

module.exports = {
    getByUsername,
    getByEmail,
    getById,
    saveUsuario,
    transformUsuario
}
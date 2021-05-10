'use stricts'

let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000/api/v3/user'
let ID_ALUMNO = 0;
let ID_TUTOR = 0;

//LOGIN
describe('Successfull login: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/login')
            .send({
                "username": "admin",
                "password": "admin"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe('Unsuccessfull login: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/login')
            .send({
                "username": "adminError",
                "password": "admin"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(401);
                done();
            })
    })
})


//REGISTER ALUMNO
//router.post('/register/alumno', userController.registerAlumno);
describe('Successfull alumn register: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                ID_ALUMNO = res.id;
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of username: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": null,
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                console.log(res.statusMessage);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of password: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": null,
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                console.log(res.statusMessage);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of confirm password: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": null,
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of nombre: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": null,
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of apellidos: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": null,
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of email: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": null,
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to wrong email format: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio12dsfpruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of universidad: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": null,
                "grado": "Ingeniería aeroespacial"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to lack of grado: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": null
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

/* describe('Unsuccessfull alumn register due to repeated username: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebas",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio2@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(422);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to repeated email: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas2",
                "password": "AntonioPruebas2",
                "confirmPassword": "AntonioPruebas2",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(422);
                done();
            })
    })
})

describe('Unsuccessfull alumn register due to different password/confirmPassword: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebas",
                "confirmPassword": "AntonioPruebasError",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio2@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(422);
                done();
            })
    })
}) */




//REGISTER TUTOR
//router.post('/register/tutor', userController.registerTutor);
describe('Successfull tutor register: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebasTutor",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                ID_TUTOR = res.id;
                done();
            })
    })
})
//--------------------------------
describe('Unsuccessfull tutor register due to lack of username: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": null,
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of password: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebasTutor",
                "password": null,
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of confirm password: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebasTutor",
                "password": "AntonioPruebasTutor",
                "confirmPassword": null,
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of nombre: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": null,
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of apellidos: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": null,
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of email: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": null,
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to wrong email format: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor12dsfpruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of universidad: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": null,
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of grado: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": null,
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull tutor register due to lack of descripcion: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebas",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el Tutor de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": null,
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

/* describe('Unsuccessfull tutor register due to repeated username: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebasTutor",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutor",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "Antonio2@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(422);
                done();
            })
    })
}) */

/* describe('Unsuccessfull tutor register due to repeated email: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "AntonioPruebasTutor2",
                "password": "AntonioPruebasTutor2",
                "confirmPassword": "AntonioPruebasTutor2",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "AntonioTutor@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(422);
                done();
            })
    })
}) */

/* describe('Unsuccessfull tutor register due to different password/confirmPassword: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post('/register/alumno')
            .send({
                "username": "AntonioPruebasTutor",
                "password": "AntonioPruebasTutor",
                "confirmPassword": "AntonioPruebasTutorError",
                "nombre": "Antonio",
                "apellidos": "el de las Pruebas",
                "email": "AntonioTutor2@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(422);
                done();
            })
    })
}) */

//GET USER BY ID
//router.get('/:id', userController.getUsuarioById);
describe('Succesfull get a user by its id: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .get(`/1`)
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe('Unsuccesfull get a user by its id: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .get(`/666666666666666666666666666666666`) //??????????????????????
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(404);
                done();
            })
    })
})

//UPDATE USER
//router.post('/update', userController.updateUser);
describe('Successfull update: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe('Unsuccessfull update due to lack of username: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": null,
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to lack of nombre: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": null,
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to lack of apellidos: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": null,
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to lack of email: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": null,
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to wrong email format: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio12dsfpruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to lack of universidad: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": null,
                "grado": "Ingeniería aeroespacial",
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to lack of grado: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": null,
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe('Unsuccessfull update due to invalid user id: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioPruebas",
                "id": 666666666666666666666666666666666,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": null,
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})

/* describe('Unsuccessfull update due to already used username: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "alumno",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "Antonio@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": null,
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe('Unsuccessfull update due to already used email: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/update')
            .send({
                "username": "AntonioAlumno",
                "id": ID_ALUMNO,
                "nombre": "Antonio",
                "apellidos": "el de los Cambios",
                "email": "alumno@alumno.com",
                "universidad": "Universidad de Sevilla",
                "grado": null,
                "descripcion": "Soy un tutor nuevo muy bueno",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
}) */

//GET TUTORES
//router.get('/role/tutor', userController.getTutores);
describe('Succesfull get tutores: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .get(`/role/tutor`)
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})


//GET MIS TUTORES
//router.get('/:id/myTutors', userController.getMisTutores);
describe('Succesfull get mis tutores: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .get(`/${ID_ALUMNO}/myTutors`)
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

/* describe('Unsuccesfull get mis tutores due to bad user id: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .get(`/6666666666666666666666666666/myTutors`) //??????????????????????
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(500);
                done();
            })
    })
}) */

//TRANSFORM ALUMNO -> TUTOR
//router.post('/transform/:id', userController.transformAlumnoToTutor);
describe('Succesfull transformation from alumn to tutor: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post(`/transform/${ID_ALUMNO}`)
            .send({
                "descripcion": "Soy un alumno que se ha convertido en tutor",
                "telefono": "674000000"
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe('Unsuccesfull transformation from alumn to tutor due to lack of description: ', () => {
    it('should return an error', (done) => {
        chai.request(url)
            .post(`/transform/${ID_ALUMNO}`) //??????????????????????
            .send({
                "descripcion": null,
                "telefono": ""
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(400);
                done();
            })
    })
})
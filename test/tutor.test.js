'use stricts'

let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000/api/v3/tutor'
let ID_TUTOR = 0;

/* describe('Successfull tutor register: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/register/tutor')
            .send({
                "username": "TutorPruebasTutorias",
                "password": "TutorPruebasTutorias",
                "confirmPassword": "TutorPruebasTutorias",
                "nombre": "TutorPruebas",
                "apellidos": "el Tutor de las Pruebas de las Tutorias",
                "email": "TutorTutorias@pruebas.com",
                "universidad": "Universidad de Sevilla",
                "grado": "Ingeniería informatica",
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
}) */

//GET ASIGNATURAS BY TUTOR
//router.get('/asignaturas/:idTutor', roomController.getAsignaturasByTutor)
describe('Successfull get asignaturas by tutor: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .get('/asignaturas/3')
            .send({
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe('Unsuccessfull get asignaturas by tutor: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post(`/asignaturas/${ID_TUTOR}`)
            .send({
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(404);
                done();
            })
    })
})
"use stricts"

let chai = require("chai")
let chaiHttp = require("chai-http")
const expect = require("chai").expect;

chai.use(chaiHttp);
const url = "http://localhost:3000/api/v3/room"

let guidPrivateRoom = "";
let guidPublicRoom = "";


// Tests Metodo: createRoom
describe("Successfull Create Public Room: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Sala de estudio",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2022-05-18T16:00:00Z",
                "ending_time": "2022-05-18T18:00:00Z",
                "date": "2022-05-18",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 0,
                "is_private": false,
                "id_user": 2
            })
            .end(function (err, res) {
                guidPublicRoom = res.body.id_room
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe("Successfull Create Private Room: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2022-05-18T16:00:00Z",
                "ending_time": "2022-05-18T18:00:00Z",
                "date": "2022-05-18",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [2],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                guidPrivateRoom = res.body.id_room
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of description: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": null,
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of university: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria ejemplo",
                "university": "",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of degree: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutori",
                "university": "Sevilla",
                "degree": "",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of starting_time: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of ending_time: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of date: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of iTime: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of fTime: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of authorised_users: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of price_per_hour: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": null,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of is_private : ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": null,
                "id_user": 3
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Create Room due to lack of id_user: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/create")
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2020-05-13T16:00:00Z",
                "ending_time": "2020-05-13T18:00:00Z",
                "date": "2021-05-13",
                "iTime": "16:00",
                "fTime": "18:00",
                "authorised_users": [],
                "price_per_hour": 80,
                "is_private": true,
                "id_user": null
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

// Tests Metodo: getAllRooms
describe("Succesfull Get All Active Rooms: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/all")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getRoomById
describe("Successfull Get Room By Guid: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/" + guidPrivateRoom)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe("Unuccessfull Get Room By Guid due to an non-exist guid: ", () => {
    it("should not return room data", (done) => {
        chai.request(url)
            .get("/1")
            .end(function (err, res) {
                expect(res).to.have.status(401);
                done();
            })
    })
})

// Tests Metodo: getSalasEstudioActivas
describe("Successfull Get Active Study Rooms from students: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/student/all")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getTutoriasActivas
describe("Successfull Get Active Study Rooms from tutors: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/tutor/all")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getMisSalas
describe("Successfull Get Rooms Made By Me: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/mine/3")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getMisTutoriasPagadas
describe("Successfull Get Rooms Paid By Me: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/Tmine/2")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getMisTutorias
describe("Successfull Get Rooms Made By Me as tutor: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/tutor/mine/3")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: anadirAutorizados
describe("Successfull Add Authorised User: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/autorizar")
            .send({
                "guid": guidPrivateRoom,
                "id_user": 1
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

describe("Unsuccessfull Add Authorised User due to lack of guid: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/autorizar")
            .send({
                "id_user": 1
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Add Authorised User due to lack of id_user: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/autorizar")
            .send({
                "guid": guidPrivateRoom
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            })
    })
})

describe("Unsuccessfull Add Authorised User due to passing an user that already payed for the room: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .post("/autorizar")
            .send({
                "guid": guidPrivateRoom,
                "id_user": 2
            })
            .end(function (err, res) {
                expect(res).to.have.status(423);
                done();
            })
    })
})

// Tests Metodo: getSalasEstudioActivasById
describe("Successfull Get Active Public Rooms By Guid: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/student/" + guidPublicRoom)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getTutoriasActivasById
describe("Successfull Get Private Public Rooms By Guid: ", () => {
    it("should return room data", (done) => {
        chai.request(url)
            .get("/tutor/" + guidPrivateRoom)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: getUsuariosByTutoria
describe("Successfull Get Users By Private Room: ", () => {
    it("should return authorised users", (done) => {
        chai.request(url)
            .get("/usuariosAutorizados/" + guidPrivateRoom)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})

// Tests Metodo: deleteRoom
describe("Successfull Delete Room: ", () => {
    it("should delete room ", (done) => {
        console.log(guidPublicRoom)
        chai.request(url)
            .delete(`/delete/${guidPublicRoom}` )
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            })
    })
})
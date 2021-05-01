'use stricts'

let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://46.101.34.232:1741/api/v2'

describe('Successfull login: ', () => {
    it('should return user data', (done) => {
        chai.request(url)
            .post('/user/login')
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
            .post('/user/login')
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
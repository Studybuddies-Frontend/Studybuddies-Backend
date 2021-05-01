'use stricts'

let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://46.101.34.232:1741/api/v2'

describe('Create Successfull Room: ', () => {
    it('should return room data', (done) => {
        chai.request(url)
            .post('/room/create')
            .send({
                "description": "Tutoria",
                "university": "Sevilla",
                "degree": "Ingenieria Informatica",
                "subject": "EGC",
                "starting_time": "2021-05-18T16:00:00Z",
                "ending_time": "2021-05-18T17:00:00Z",
                "price_per_hour": 80,
                "is_private": true,
                "id_user": 3
            })
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})
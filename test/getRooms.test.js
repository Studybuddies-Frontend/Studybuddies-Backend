'use stricts'

let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000/api/v2'

describe('Get All Active Rooms: ', () => {
    it('should return room data', (done) => {
        chai.request(url)
            .get('/room/all')
            .end(function (err, res) {
                //console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    })
})
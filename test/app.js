let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
chai.use(chaiHttp);

describe('Books', () => {
describe('GET /book/:isbn', () => {
    it('it should GET the which has the ISBN number provided', (done) => {
      chai.request(server)
          .get('/book/'+'5554-5545-4518')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
            done();
          });
    });
});
});
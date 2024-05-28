const request = require('supertest');
const chai = require('chai');
const app = require('../server'); // Importa tu app de Express

const expect = chai.expect;

describe('API endpoints', () => {
  it('should get all employees hired by quarter in 2021', done => {
    request(app)
      .get('/api/employees/employees-hired-quarters')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        //  Here we can add more assertions based on the structure of our data
        done();
      });
  });

  it('should get all departments with above mean hires in 2021', done => {
    request(app)
      .get('/api/departments/departments-above-mean')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        //  Here we can add more assertions based on the structure of our data
        done();
      });
  });
});

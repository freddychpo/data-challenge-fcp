const request = require('supertest');
const chai = require('chai');
const app = require('../server');
const path = require('path');
const fs = require('fs');

const expect = chai.expect;

describe('API endpoints', () => {
    it('should upload a valid CSV file', done => {
      request(app)
        .post('/upload-csv')
        .attach('file', fs.readFileSync(path.join(__dirname, 'valid.csv')), 'valid.csv')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

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

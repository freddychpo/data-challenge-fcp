import * as chai from 'chai';
import app from '../server.js';
import path from 'path';
import fs from 'fs';
import supertest from 'supertest';

const request = supertest(app);
const expect = chai.expect;

describe('API endpoints', () => {
    it('should upload a valid CSV file', done => {
      request
        .post('/upload-csv')
        .attach('file', fs.readFileSync(path.join(__dirname, 'valid.csv')), 'valid.csv')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should get all employees hired by quarter in 2021', done => {
      request
        .get('/api/employees/employees-hired-quarters')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should get all departments with above mean hires in 2021', done => {
      request
        .get('/api/departments/departments-above-mean')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
});

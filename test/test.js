var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseUrl = "http://34.209.33.250:4200";

var util = require('util');

describe('mocha test for API', function () {
    describe('return user info from /login', function() {
        it('return user', function (done) {
            request.post({
                url: baseUrl + '/login',
                form: {
                    email: "linxiaoran2018@gmail.com",
                    password: "Lx860210!"
                }
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe('return profile info from /profile', function() {
        it('return profile', function (done) {
            request.post({
                url: baseUrl + '/login',
                form: {
                    email: "linxiaoran2018@gmail.com",
                    password: "Lx860210!"
                }
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe('return profile info from /postproject', function() {
        it('return project', function (done) {
            request.post({
                url: baseUrl + '/login',
                form: {
                    email: "linxiaoran2018@gmail.com",
                    password: "Lx860210!"
                }
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe('return profile info from /getbidlist', function() {
        it('return bidlist', function (done) {
            request.post({
                url: baseUrl + '/login',
                form: {
                    email: "linxiaoran2018@gmail.com",
                    password: "Lx860210!"
                }
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe('return profile info from /allprojects', function() {
        it('return all projects', function (done) {
            request.post({
                url: baseUrl + '/login',
                form: {
                    email: "linxiaoran2018@gmail.com",
                    password: "Lx860210!"
                }
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
    })
})
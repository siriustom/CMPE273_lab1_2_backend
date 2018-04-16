var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseUrl = "http://34.209.33.250:4200";

var util = require('util');

describe('return user', function () {
    it('return user', function (done) {
        request.post({
            url: baseUrl + '/login',
            form: {
                email: "linxiaoran2018@gmail.com",
                password: "Lx860210!"
            }}, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        })
    })
})
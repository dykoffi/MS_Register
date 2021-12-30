"use strict"

const frisby = require('frisby')

const URL = "http://localhost:8888"

describe('Patient routes tester', () => {

    it("/POST Create new Patient", () => {
        return frisby
            .post(`${URL}/Patient`)
            .expectNot("status", 500);
    });

    it("/GET get all Patient", () => {
        return frisby
            .get(`${URL}/Patient`)
            .expectNot("status", 500)
    });

    it("/GET/id Show specify Patient", () => {
        return frisby
            .get(`${URL}/Patient/1`)
            .expectNot("status", 500)
    });

    it("/PUT/id Modify specify Patient", () => {
        return frisby
            .put(`${URL}/Patient/1`)
            .expectNot("status", 500)
    });

    it("/DELETE/id Delete specify Patient", () => {
        return frisby
            .del(`${URL}/Patient/1`)
            .expectNot("status", 500)
    });

});
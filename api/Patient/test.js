"use strict"

const frisby = require('frisby')
require('dotenv').config()

const URL = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`

describe('Patient routes tester', () => {

    it("/GET get all Patient", () => {
        return frisby
            .get(`${URL}/Patient`)
            .expectNot("status", 500)
    });

    it("/POST Create new Patient", () => {
        return frisby
            .post(`${URL}/Patient`, { nom: 'Koffi', prenoms: 'Edy', numCNI: '654b6tteg', dateNaissance: '2021-11-05' })
            .expectNot("status", 500);
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
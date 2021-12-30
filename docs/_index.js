"use strict"

const generalDocs = require("./info.json")

const PatientDocs = require('../api/Patient/docs.json') 

module.exports = {
    ...generalDocs,
    paths: { 
        ...PatientDocs,
    }
}
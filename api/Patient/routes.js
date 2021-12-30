"use strict"

const router = require('express').Router()
const { cryptObject, dcryptObject, dcryptArrayObject } = require('cqx-secure')
const { patient } = require('../../db')

router

    /**
     * @descr Create new patient
     * @route POST /patient
     * @access public
     */

    .post("/", async (req, res) => {

        let data = cryptObject(req.body, { recursive: true })

        patient.create({ data: { ...data } })
            .then(data => { res.status(201).json(data) })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'InternalError', message: "Something wrong" })
            })

    })

    /**
    * @descr get all patient
    * @route GET /patient
    * @access public
    */

    .get("/", async (req, res) => {

        patient.findMany({ where: req.query, orderBy: { id_: 'asc' } })
            .then(data => { res.json(dcryptArrayObject(data, { excludes: "id_" })) })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'InternalError', message: "Something wrong" })
            })

    })

    /**
    * @descr Show specify patient identified by id
    * @route GET /patient/id
    * @access public
    */

    .get("/:id", async (req, res) => {

        patient.findUnique({ where: { id_: parseInt(req.params.id) } })
            .then(data => {
                if (data !== null) {
                    res.status(200).json(dcryptObject(data, { excludes: "id_" }))
                } else {
                    res.status(404).json({ error: 'NotFound', message: "Record not found" })
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'InternalError', message: "Something wrong" })
            })

    })

    /**
    * @descr Modify specify patient identified by id
    * @route PUT /patient/id
    * @access public
    */

    .put("/:id", async (req, res) => {

        patient.update({ where: { id_: parseInt(req.params.id) }, data: cryptObject(req.body) })
            .then(() => {
                res.status(201).json({ message: "patient updated succefully" })
            })
            .catch(error => {

                console.error(error);
                if (error?.code === "P2025") {
                    res.status(404).json({ error: 'NotFound', message: error.meta?.cause })
                } else {
                    res.status(500).json({ error: 'InternalError', message: "Something wrong" })
                }

            })

    })

    /**
    * @descr Delete specify patient identified by id
    * @route DELETE /patient/id
    * @access public
    */

    .delete("/:id", async (req, res) => {

        patient.delete({ where: { id_: parseInt(req.params.id) } })
            .then(() => {
                res.status(201).json({ message: "patient deleted succefully" })
            })
            .catch(error => {
                console.error(error);
                if (error?.code === "P2025") {
                    res.status(404).json({ error: error.name, message: error.meta?.cause })
                } else {
                    res.status(500).json({ error: 'InternalError', message: "Something wrong" })
                }
            })

    })

module.exports = router

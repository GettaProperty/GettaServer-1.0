const database = require("../database")
const express = require("express")
const { ObjectId } = require("mongodb")
const { response } = require("express")
const router = express.Router()
const multer = require('multer')
module.exports = router

router.post('/addproperty', addproperty)
router.post('/getallproperties', getallproperties)
router.post('/getproperty', getproertybyid)
router.post('/updateproperty', updateproperty)
router.post('/getcities', getcities)
router.post('/getdatabyfilter', getdatabyfilter)
router.post('/getdatabyfilter4', getdatabyfilter4)
router.post('/getbuilders', getbuilders)

let Urlarray = []
let prof_url = ''

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null,'uploads/images')
    },
    filename: (req, file, callBack) => {
        Urlarray.push(`http://localhost:7077/images/Getta_${file.fieldname}_${Date.now()/1000}_${file.originalname}`)
        callBack(null, `Getta_${file.fieldname}_${Date.now()/1000}_${file.originalname}`)
    }
})

const storage_prof = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null,'uploads/images')
    },
    filename: (req, file, callBack) => {
        prof_url = `http://localhost:7077/images/GettaProfile_${file.fieldname}_${Date.now()/1000}_${file.originalname}`
        callBack(null, `GettaProfile_${file.fieldname}_${Date.now()/1000}_${file.originalname}`)
    }
})

var upload = multer({ storage : storage})

let upload_prof = multer({ storage : storage_prof})

async function addproperty(req, res) {
    database.collection('properties').insertOne(req.body)
        .then(response => res.status(200).send({ status: "success", id: response.insertedId }))
        .catch(err => res.status(400).send({ status: "failed", err: err.message }))
}

async function getallproperties(req, res) {
    database.collection('properties').find().toArray()
        .then(response => res.status(200).send({ status: "success", response }))
        .catch(err => res.status(400).send({ status: "failed", err: err.message }))
}

async function getproertybyid(req, res) {
    database.collection('properties').findOne({ _id: ObjectId(req.body.id) })
        .then(response => {
            res.status(200).send({ status: "success", response })})
        .catch(err => res.status(400).send({ status: "failed", err: err.message }))
}

async function updateproperty(req, res) {
    database.collection('properties').updateOne({ _id: ObjectId(req.body.id) }, { $set: req.body.data })
        .then(response => res.status(200).send({ status: "success", id: response.modifiedCount }))
        .catch(err => res.status(400).send({ status: "failed", err: err.message }))
}

async function getcities(req, res) {
    try {
        let data = (await database.collection('properties').distinct('city')).sort()
        res.status(200).send({ status: "success", response: data })
    }
    catch (err) {
        res.status(400).send({ status: "failed", err: err.message })
    }
}


async function getbuilders(req, res) {
    try {
        let data = (await database.collection('properties').distinct('builder')).sort()
        res.status(200).send({ status: "success", response: data })
    }
    catch (err) {
        res.status(400).send({ status: "failed", err: err.message })
    }
}

async function getdatabyfilter(req, res) {
    // if (req.body.price) {
    //     database.collection('properties').find({...req.body,"price" : {$lt : req.body.price}}).toArray()
    //         .then(response => res.status(200).send({ status: "success", response }))
    //         .catch(err => res.status(400).send({ status: "failed", err: err.message }))
    // }
    // else {
        database.collection('properties').find(req.body).toArray()
            .then(response => res.status(200).send({ status: "success", response }))
            .catch(err => res.status(400).send({ status: "failed", err: err.message }))
    // }
}

async function getdatabyfilter4(req, res) {
   
        database.collection('properties').find(req.body).limit(4).toArray()
            .then(response => res.status(200).send({ status: "success", response }))
            .catch(err => res.status(400).send({ status: "failed", err: err.message }))

}


router.post('/uploadImage',upload.array('images'),check)

router.post('/uploadProfileImage',upload_prof.single('image'),check_prof)


async function check_prof(req,res){
    res.status(200).send(JSON.stringify(prof_url))
    prof_url = ''
}

async function check(req, res) {
    res.status(200).send(Urlarray)
    Urlarray = []
}

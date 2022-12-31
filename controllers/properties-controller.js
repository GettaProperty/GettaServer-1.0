const database = require("../database")
const express = require("express")
const { ObjectId } = require("mongodb")
const { response } = require("express")
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
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

const s3 = new S3({
    region : 'us-east-1',
    accessKeyId : 'AKIAWG2LJFFAOPXSVNYM',
    secretAccessKey : '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'
})


function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadPrams = {
        Bucket: 'gettaimages',
        Body : fileStream,
        Key: file.filename
    }

    return s3.upload(uploadPrams).promise()
}


function getfilestram(filekey) {
    const downloadParams = {
        Key : filekey,
        Bucket: 'gettaimages'
    }

    return s3.getObject(downloadParams).createReadStream()
}

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null,'uploads/images')
    },
    filename: (req, file, callBack) => {
        Urlarray.push(`http://api/images/Getta_${file.fieldname}_${Date.now()/1000}_${file.originalname}`)
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
    let result = await uploadFile(req.file)
    res.status(200).send(JSON.stringify(result.Key))
    prof_url = ''
}

async function check(req, res) {
    let image_array = []
    for(let i of req.files){
        let result = await uploadFile(i)
        image_array.push(result.Key)
    }
    res.status(200).send(image_array)
}

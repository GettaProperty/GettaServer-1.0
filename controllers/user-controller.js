const database = require("../database")
const express = require("express")
const router = express.Router()
module.exports = router

router.post('/getuser',getuser)
router.post('/adduser',adduser)

async function getuser(req,res){
    database.collection('users').find(req.body).toArray()
    .then(response => {
        res.status(200).send(response)})
    .catch(err => res.status(400).send([]))
}


async function adduser(req,res){
    database.collection('users').insertOne(req.body)
    .then(response => res.send(response.insertedId))
    .catch(err => res.status(400).send(err.message))
}


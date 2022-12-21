const accountSid = `ACcc6c58c363872afa35a69f93f7c6e9b2`
const authToken = `922ee182f5cb5d78abecfeaa954903f7`
const express = require("express")
const router = express.Router()
module.exports = router
const client = require('twilio')(accountSid, authToken);
router.post('/sendsms',sendsms)

async function sendsms(req,res) {
    client.messages
        .create({ body:req.body.name+''+''+req.body.email, from: '+19894742230', to: "+91"+req.body.phno })
        .then(message => res.status(200).send(message))
        .catch(err=>{
            res.status(400).send(err.message)});
}

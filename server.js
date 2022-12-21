const bodyParser = require('body-parser')

const express = require('express')//npm i express --save

const port = process.env.PORT || 7077
const app = express()
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json({limit:'50mb'}))
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const user = require("./controllers/user-controller")
const mail = require("./controllers/mail-controller")
const sms = require("./controllers/sms-controller")
const property = require("./controllers/properties-controller")

app.use('/user', user)
app.use('/mail',mail)
app.use('/sms',sms)
app.use('/property',property)
app.use('/images',express.static('uploads/images'))

app.listen(port, () => console.log(`Server listening on port ${port}`)) 
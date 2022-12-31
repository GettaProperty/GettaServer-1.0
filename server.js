const bodyParser = require('body-parser')

const express = require('express')//npm i express --save

const port = process.env.PORT || 7077
const app = express()
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json({limit:'50mb'}))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const S3 = require('aws-sdk/clients/s3')
const s3 = new S3({
    region : 'us-east-1',
    accessKeyId : 'AKIAWG2LJFFAOPXSVNYM',
    secretAccessKey : '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'
})

const user = require("./controllers/user-controller")
const mail = require("./controllers/mail-controller")
const sms = require("./controllers/sms-controller")
const property = require("./controllers/properties-controller")


function getfilestram(filekey) {
    const downloadParams = {
        Key : filekey,
        Bucket: 'gettaimages'
    }

    return s3.getObject(downloadParams).createReadStream()
}

app.use('/user', user)
app.use('/mail',mail)
app.use('/sms',sms)
app.use('/property',property)
app.use('/images',express.static('uploads/images'))
app.get('/images/:key',(req, res)=>{
    const key = req.params.key
    const readStream = getfilestram(key)

    readStream.pipe(res)
})

app.listen(port, () => console.log(`Server listening on port ${port}`)) 
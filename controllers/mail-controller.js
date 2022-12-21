const axios = require('axios');
const express = require("express")
const router = express.Router()
module.exports = router

router.post("/sendmail",mailsend)


async function mailsend(req, res) {
    const {name, email, subject, message} = req.body;
    //implement your spam protection or checks.
    let result = await sendEmail(req.body.name, req.body.email , `test`, `${req.body.name}+''+is seeing your wesite+' '+${req.body.phno}+' '+is their contact_no`);
    res.status(200).send(result)
  }


async function sendEmail(name, email, subject, message) {
  const data = JSON.stringify({
    "Messages": [{
      "From": {"Email": "likhiraam2000@gmail.com", "Name": "likhith"},
      "To": [{"Email": email, "Name": name}],
      "Subject": subject,
      "TextPart": message
    }]
  });

  const config = {
    method: 'post',
    url: 'https://api.mailjet.com/v3.1/send',
    data: data,
    headers: {'Content-Type': 'application/json'},
    auth: {username: '6e91115328106a4e9b6f1f1a6ada41af', password: '9b9cfba484e4bd6c9c19d23fe60798b3'},
  };

  return axios(config)
    .then(function (response) {
      return {status : 'success'}
    })
    .catch(function (error) {
      return {status : 'failed'}
    });

}

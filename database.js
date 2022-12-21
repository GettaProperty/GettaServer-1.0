const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://gettauser:Password%40getta@getta.nxsdxqy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useUnifiedTopology: true });
client.connect()

const database = client.db('getta')
module.exports = database
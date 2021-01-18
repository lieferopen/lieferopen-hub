const express = require('express')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
var ObjectId = require('mongodb').ObjectID;

let db = null;
let connection_string = process.env.CONNECTION_STRING || 'mongodb://root:Pass1word@localhost:27017';

MongoClient.connect(connection_string, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    db = client.db('jufo')
})

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const app = express()
app.use(bodyParser.json())

app.post("/locations", cors(corsOptions), (req, res) => {

    console.log(req.body)

    if (db) {
        const usersCollection = db.collection('locations')
        usersCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.send("ok");
            })
            .catch(error => {
                res.send("error");
                console.error(error)
            })
    } else {
        res.send("error: db error");

    }

})

app.patch('/locations/:details', cors(corsOptions), (req, res) => {

    if (db) {
        db.collection('locations')
            .updateOne(
                { "_id": ObjectId(req.params.details) },
                {
                    $set: req.body
                }
            )
            .then(results => {
                console.log(results)
                res.send(results)
            })
            .catch(error => {
                console.error(error)
                res.send("error");
            })
    } else {
        res.send("error: db error");

    }
})


app.get('/locations', cors(corsOptions), (req, res) => {

    if (db) {
        db.collection('locations').find().toArray()
            .then(results => {
                console.log(results)
                res.send(results)
            })
            .catch(error => {
                console.error(error)
                res.send("error");
            })
    } else {
        res.send("error: db error");

    }
})

app.get('/locations/:details', cors(corsOptions), (req, res) => {

    // res.send(req.params);

    if (db) {
        db.collection('locations').findOne(ObjectId(req.params.details))
            .then(results => {
                console.log(results)
                res.send(results)
            })
            .catch(error => {
                console.error(error)
                res.send("error");
            })
    } else {
        res.send("error: db error");

    }
})


const startServer = async () => {
    const port = process.env.SERVER_PORT || 8080
    await promisify(app.listen, '0.0.0.0').bind(app)(port)
    console.log(`Listening on port ${port}`)
}

startServer()
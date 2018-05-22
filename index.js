/**
 * Created by Micky on 20.4.2018.
 */


'use strict'
var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(cors())
var flatfile = require('flat-file-db');
var db = flatfile('./tmp/mydatabase.db');



// to support JSON-encoded bodies
app.use( bodyParser.json() );
var keys = db.keys();
db.put(0, {search: "Eminem", searchType: "artist"});
let idCounter = 1;

app.get("/searches/:id([0-9]+)", function(req, res) {
    if(db.has(req.params.id)) {
        let result = db.get(req.params.id);
        res.send(result);
    } else {
        let message =
            {
                "code": 404,
                "message": "Resource not found.",
                "description": "The resource with id = " + req.params.id + " did not exist."
            };

        res.status(404);
        res.send(message);

    }

});

app.get('/searches', function (req, res) {
    var keys = db.keys();
    var data = [];
    for(let key in keys) {
        console.log(db.get(key))
        if(db.has(key)) {

            data.push({object:db.get(key), id: key });
        }

    }
    res.send(data);
})

app.post('/searches/', function(req, res) {
    console.log(req.body);

    db.put(idCounter, {search: req.body.search, searchType: req.body.searchType });
    res.status(201);
    res.location("http://localhost:3000/searches/" + idCounter);
    res.send({search: req.body.search,searchType: req.body.searchType, id: idCounter});
    idCounter++;

});

app.delete("/searches/:id([0-9]+)", function (req, res) {

    if(db.has(req.params.id)) {

        res.status(200);
        res.send({name: db.get(req.params.id).name, id: req.params.id});
        db.del(req.params.id);

    } else {
        let message =
            {
                "code": 404,
                "message": "Resource not found.",
                "description": "The resource with id = " + req.params.id + " did not exist."
            };

        res.status(404);
        res.send(message);

    }
})

var server = app.listen(3000, function () {
    console.log('Server listening in http://localhost:3000/searches')
})


// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
const express = require('express');
const path = require('path');
const fs = require('fs');
// creates a unique hexatridecimal id
var uniqid = require('uniqid');

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up the Express app to serve static assets directly
app.use(express.static('public'));

//API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('/db/db.json', 'utf8', (err, data) => {
        err ? console.log(err): res.json(data);
    });
});

app.post('/api/notes', (req, res) => {
    let readNotes = []
    fs.readFileSync('/db/db.json', 'utf8', (err, data) => {
        err ? console.log(err): readNotes = data;
    });

    // creates unique id for note object in req.body
    req.body.id = uniqid();

    // adds new note object to array of notes from readFile
    readNotes.push(req.body);

    fs.writeFileSync('/db/db.json', readNotes, 'utf8', (err) => {
        if (err) {console.log(err)};
    });
});

//HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

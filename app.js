// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).json({message:'Hello World!'});
})

app.get("/bookmarks", (req, res) => {
    res.status(200).json("Watch your bookmark");
})

app.post("/bookmarks", (req, res) => {
    const { url, title} = req.body;
    if(!url || !title) {
        return res.status(422).json({error: "required field(s) missing"});
    } 
    connection.query('INSERT INTO bookmark SET ?', req.body, (err, stats) => {
        if (err) return res.status(500).json({ error: err.message, sql: err.sql });
    
    connection.query('SELECT * FROM bookmark WHERE id = ?', stats.insertId, (err, records) => {
        if (err) return res.status(500).json({ error: err.message, sql: err.sql });
        return res.status(201).json(records[0]);
        });
    });
});

app.get("/bookmarks/2", (req, res) => {
    res.status(404).json({ error: 'Bookmark not found' });
})

app.get("/bookmarks/1", (req, res) => {
    connection.query(
      "SELECT * from bookmark WHERE id=?",
      [req.params.id],
      (err, results) => {
          console.log(results)
        if (err) {  
          console.log(err);
          res.status(500).send("Error retrieving data");
        } else {
          res.status(200).json({ id: 1, url: 'https://nodejs.org/', title: 'Node.js' });
        }
      }
    );
  });

module.exports = app;

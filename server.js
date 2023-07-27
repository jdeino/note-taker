const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));


// GET & POST request

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), (err,data) => {
        if(err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if (!title || !text ) {
        throw new Error("title and text cannot be blank");
    }
 const newNote = {title, text, id: uuidv4()};
 fs.readFile(path.join(__dirname, "/db/db.json"), (err,data) => {
    if(err) {
        console.log(err);
    }
    else {
        const dbNotes = JSON.parse(data);
        dbNotes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(dbNotes),(err) => 
        err ? console.error(err) : console.log("Successfully added note."))
    }

 })
 const response = {
    body: newNote
 }
 console.log(response)
 res.json(response)
})



// HTML routes

app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname,"/public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});



app.listen(PORT, () =>
  console.log(`Listening for requests on port ${PORT}! 🏎️`)
);

//hardcode URL for AJAX post and get
const noteURL = "/api/notes"

// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

//db.json file path & fs
const database = require("./db/db.json")
const { env } = require("process");
//const { getJSON } = require("jquery");


// Sets up the Express App
// =============================================================
const notetaker = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express notetaker to handle data parsing
notetaker.use(express.urlencoded({ extended: true }));
notetaker.use(express.json());

//Serve CSS & JS files from public folder
notetaker.use('/assets', express.static(path.join(__dirname, './public/assets')))

//Routing for notes.html from notetaker.js as root directory
notetaker.get("/notes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Read JSON file from JSON Database directory
notetaker.get(noteURL, (req, res) => {
  return res.json(database)
});

//Read user title input and note text, push the new input into existing DB JSON 
notetaker.post(noteURL, (req, res) => {
  
  //Declare variable to receive input object
  let noteAdd = req.body;
  console.log(noteAdd)
  
  //Read Existing object array from JSON DB and push received input into this
  fs.readFile("db/db.json", (err, response) => {
    if (err) throw err;
    const existingJSONDB = JSON.parse(response);
    console.log(existingJSONDB)    
    existingJSONDB.push(noteAdd)
    
    //Write the updated Database back to JSOn DB database to replace the last record
    fs.writeFile("db/db.json", JSON.stringify(existingJSONDB), (err) => {
      if (err)
      console.log(err);
      else {
        console.log("\nNOTES DATABASE SUCCESSFULLY UPDATED...\n");
      };
      });
    res.json(existingJSONDB);
    });
  });

//Delete Action
notetaker.delete("/api/notes/:id", (req, res) => {
  console.log("/api/notes/:iddelete");
  deleteNoteFromJSON(red.params.id);
  res.json(getJSON());
});
function getJSON(){
  let data = fs.readFileSync(__dirname + "/d/db.json");
  let json = JSON.parse(data);
  return json;
}

notetaker.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

notetaker.listen(PORT, () => {
    console.log("\nNote Taker Server Listening on PORT " + PORT+"\n");
  });
  
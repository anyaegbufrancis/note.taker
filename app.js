//hardcode URL for AJAX post and get
const noteURL = "/api/notes"

// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid-random")
const { env } = require("process");
const color = require("color")

//db.json file path & fs
const database = require("./db/db.json")


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
    
  //Inject UUID to received title and text body object using spread operator  
  const requestID = {id: uuid()}; 
  let noteAdd =  {...(req.body), ...requestID} 
  
  
  //Read Existing object array from JSON DB and push received input into this
  fs.readFile("./db/db.json", (err, response) => {
    if (err) throw err;
    const existingJSONDB = JSON.parse(response); 
    existingJSONDB.push(noteAdd)    
    //console.log(existingJSONDB)  
    
    //Write the updated Database back to JSON DB database to replace the last record
    fs.writeFile("./db/db.json", JSON.stringify(existingJSONDB, null, 1), (err) => {
      if (err) throw err;
      else {
        console.log("\nNOTES DATABASE SUCCESSFULLY UPDATED...\n");
      };
      });
    res.json(existingJSONDB);    
    });
  });

//Finds the object that matches the id, use ES6 array.filter to return only non matching objects
notetaker.delete(noteURL+"/:id", function (req, res) {
  
  //Read the existing array
     fs.readFile("./db/db.json", (err, data) => { 
       if (err)  throw err ; 
       let dbJSON = JSON.parse(data)
       
       //Filter off object with matching id and return the new array
       let returnedDBJSON = dbJSON.filter((existingJSONDB)=> {return existingJSONDB.id !== req.params.id})  
       //Write back filtered object to the DB
       fs.writeFile("./db/db.json", JSON.stringify(returnedDBJSON, null, 1), (err) => {
         if (err)  throw err ; 
         res.send(returnedDBJSON);         
         console.log("\nSUCCESSFULLY DELETED....\n")          
             }) 
     }) 
   }) 
 
  




notetaker.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

notetaker.listen(PORT, () => {
    console.log("\nNote Taker Server Listening on PORT " + PORT+"\n");
  });
  
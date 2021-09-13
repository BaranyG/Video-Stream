//https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0

const express = require("express");
const app = express();
module.exports = app;
const fs = require("fs");
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
const port = 8000;
const moviePath = "C:/Users/Lenovo/Desktop/Torrent/"

const database = {
    Paths: [],
    Filmek: []
};
database.Paths.push(moviePath);

for(path of database.Paths){
    const Directories = fs.readdirSync(path)
    .filter(dir => !dir.includes("."));
    for(directories of Directories){
        if(!(database.Paths.includes(path+directories+"/")))
            database.Paths.push(path+directories+"/");
    }
}

const load_dir = (path) => {
    const movie_files = fs.readdirSync(path).filter(
    file => file.endsWith(".mp4") || file.endsWith(".avi") || file.endsWith(".mkv"));

    for(const file of movie_files){
        const Film = {
            Path: path + file,
            Name: file.split('.')[0],
            format: file.split('.')[1]
        }
    database.Filmek.push(Film);
    }
}

database.Paths.forEach(e => load_dir(e));

fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
    if(err) 
        console.log("Error: Writing file:", err);
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, function () {
    console.log("Listening on port " + port);
});

app.get("/video-player", function (req, res) {
    res.sendFile(__dirname + "/video.html");
});

//app.get("/handle-form-data", (req, res) => {
//    res.body.user
//});

app.post("/handle-form-data", (req, res) => {
    console.log(req.body);
});

const video = require("./video.js")(app);
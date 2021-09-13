//https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0

const express = require("express");
const app = express();
module.exports = app;
const fs = require("fs");
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
const port = 8000;
const moviePath = "E:/Torrent/"

const database = {
    Paths: [],
    Filmek: [],
    Directories: []
};
database.Paths.push(moviePath);

for(path of database.Paths){
    const Directories = fs.readdirSync(path)
    .filter(dir => fs.statSync(path+dir).isDirectory());
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
            Name: file.slice(0, file.lastIndexOf(".")),
            format: file.slice(file.lastIndexOf("."), file.length)
        }
    database.Filmek.push(Film);
    }
}

database.Paths.forEach(e => load_dir(e));


for(film of database.Filmek){
    film.Path = film.Path.toString().slice(moviePath.length);
    console.log(film.Path);
    if(!database.Directories.includes(film.Path)){
        const tempArr = film.path.split("/");
        if(tempArr.length==1){
            database.Directories.push(tempArr[0]);
        }else{
            //for(let i = 0; i++; i < tempArr.length){
            //    tempArr[i].push(tempArr[i+1]);
            //}
        }
    }
}

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

app.post("/handle-form-data", (req, res) => {
    console.log(req.body);
});

const video = require("./video.js")(app);
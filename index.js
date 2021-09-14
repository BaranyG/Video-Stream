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
    Movies: [],
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
    database.Movies.push(Film);
    }
}

database.Paths.forEach(e => load_dir(e));


for(film of database.Movies){
    film.Path = film.Path.toString().slice(moviePath.length);
    let Arr = film.Path.split("/");
    const Film = {
        Movies: Arr.pop()
    }
    
    //AZ BAAAAAJ
    if(database.Directories.length!=0){
        for(let i = 0; i < database.Directories.length; i++){
            let tempArr = [];
            tempArr = database.Directories[i];
            let index1 = database.Directories[i].length;
            let index2 = Arr.length;
            console.log(database.Directories[i], Arr);
            if(index1 == index2)
                for(let j = 0; j < index1; j++)
                    if(database.Directories[i][j] == Arr[j]);

                
                    
        
                
        }
    }
    Arr.push(Film);
    database.Directories.push(Arr);
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
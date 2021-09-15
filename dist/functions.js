const fs = require("fs");
const Path = require("path");
const moviePath = "E:/Torrent/"
const database = {
    Paths: [],
    Movies: [],
    Directories: []
};
database.Paths.push(moviePath);
const formats = [
    ".mp4",
    ".mkv",
    ".avi",
    ".ogg",
    ".wmv"
];

module.exports = {
    createPaths: function(){
        for(path of database.Paths){
            const Directories = fs.readdirSync(path)
            .filter(dir => fs.statSync(path+dir).isDirectory());
            for(directories of Directories){
                if(!(database.Paths.includes(path+directories+"/")))
                    database.Paths.push(path+directories+"/");
            }
        }
    },

    load_dir: function(path){
        const movie_files = fs.readdirSync(path).filter(
        file => formats.includes(Path.extname(file)));
    
        for(const file of movie_files){
            const Film = {
                Path: path + file,
                Name: file.slice(0, file.lastIndexOf(".")),
                Format: file.slice(file.lastIndexOf("."), file.length)
            }
        database.Movies.push(Film);
        }
    },

    createMovies: function(){
        database.Paths.forEach(e => this.load_dir(e));
    },

    createDirectories: function(){
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
                    //tempArr = database.Directories[i].filter(e => typeof e !== "object");
                    
                    console.log("\nTömb: \nIndex: ", database.Directories[i].length, database.Directories[i]);
                    
                    
                }
            }
        
            Arr.push(Film);
            database.Directories.push(Arr);
        }
    },

    createDatabase: function(){
        fs.writeFile('./database.json', JSON.stringify(database, null, 4), function(err){
            if(err)
                console.log("Error: Writing file:", err);
        });
    }
}

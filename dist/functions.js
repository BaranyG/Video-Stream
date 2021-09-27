const fs = require("fs");
const fsp = require("fs/promises");
const Path = require("path");
const moviePath = "E:/Torrent/"
const database = {
    Paths: [],
    Movies: [],
    Directories: []
};
database.Paths.push(moviePath);

const movieFolders = [];
const formats = [
    ".mp4",
    ".mkv",
    ".avi",
    ".ogg",
    ".wmv"
];

module.exports = {
    loadMovies: async function(movie_path){
        const movies = {
            Name: Path.basename(movie_path),
            Children: []
        };
        const folders = await fsp.readdir(movie_path);
        for (const child of folders){
            const childStat = await fsp.stat(Path.join(movie_path, child))
            if(childStat.isDirectory() && movieFolders.includes(child)){
                movies.Children.push(
                    await this.loadMovies(Path.join(movie_path, child))
                );
            }else if(formats.includes(Path.extname(child)))
                movies.Children.push(child);
        }
        return movies;
    },

    run: async function(){
        this.createPaths();
        this.createMovies();

        const movies_path = moviePath;

        const movies = await this.loadMovies(movies_path);
        //console.dir(movies, { depth: null });
        
        database.Directories.push(movies);

        this.createDatabase();
    },

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
            //Csúnya kód >:(
            const movieFolder = path.slice(moviePath.length).slice(0, path.slice(moviePath.length).indexOf("/"));
            if(!movieFolders.includes(movieFolder))
                if(movieFolder !== "") 
                    movieFolders.push(movieFolder);
            database.Movies.push(Film);
        }
    },

    createMovies: function(){
        database.Paths.forEach(e => this.load_dir(e));
    },

    createDatabase: function(){
        fs.writeFile('./public/database.json', JSON.stringify(database, null, 4), function(err){
            if(err)
                console.log("Error: Writing file:", err);
        });
    },
}

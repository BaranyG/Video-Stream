const fsp = require("fs/promises");
const path = require("path");

const acceptedExtensions = [
    ".mp4",
    ".mkv",
    ".avi",
    ".ogg"
];

async function loadMovies(movie_path)
{
    const movies = {
        name: path.basename(movie_path),
        children: []
    };

    const folders = await fsp.readdir(movie_path);

    for (const child of folders)
    {
        const childStat = await fsp.stat(path.join(movie_path, child))
        if (childStat.isDirectory())
        {
            movies.children.push(
                await loadMovies(path.join(movie_path, child))
            );
        }
        else if (acceptedExtensions.includes(path.extname(child)))
        {
            movies.children.push(child);
        }
    }

    return movies;
}

async function run()
{
    // change it to your movies folder;
    const movies_path = path.join(__dirname, "Movies");

    const movies = await loadMovies(movies_path);
    console.dir(movies, { depth: null })
}

run();
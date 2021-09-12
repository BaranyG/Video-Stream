//https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0

const express = require("express");
const app = express();
const fs = require("fs");

const port = 8000;
const moviePath = "C:/Users/Lenovo/Desktop/Torrent/"

const database = {
  Filmek: []
};

const load_dir = (dirs) => {
const movie_files = fs.readdirSync(moviePath + dirs).filter(
  file => file.endsWith(".mp4") || file.endsWith(".avi") || file.endsWith(".mkv"));

  for(const file of movie_files){
    const Film = {
      Path: moviePath + dirs + "/" + file,
      Name: file.split('.')[0],
      format: file.split('.')[1]
    }
    database.Filmek.push(Film);
  }
}
['teszt'].forEach(e => load_dir(e));

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

app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats
  const videoSize = fs.statSync(moviePath + "video.mp4").size;

  // Parse Range
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": ["video/mp4", "video/x-msvideo", "video/x-ms-wmv", "video/quicktime", "video/x-flv", "video/x-matroska"]
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(moviePath + "video.mp4", { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});
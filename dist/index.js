//https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0

const express = require("express");
const app = express();
module.exports = app;
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(express.static("../public"));
const func = require("./functions.js");
const port = 8000;

func.run();



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

app.get("/database", function(req, res) {
    res.sendFile(__dirname + "/database.json");
});

const video = require("./video.js")(app);

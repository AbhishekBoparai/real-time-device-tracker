const express = require("express");
const app = express();
// socket io runs on http
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

// set up of view engine and set up for express.static
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {  // Corrected the event name
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function (req, res) {  // Corrected the route path
    res.render("index");
});

server.listen(2000, function () {
    console.log("Server running on port 2000");
});

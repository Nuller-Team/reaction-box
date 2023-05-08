const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");

// Serve static files from the public directory
app.use(express.static("public"));

// Route for the home page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Route for the comment page
app.get("/comment", function(req, res) {
  res.sendFile(__dirname + "/public/comment.html");
});

// Store the connected clients in an object
const clients = {};

// Store the comments in an array
const comments = [];

// Handle socket.io connections
io.on("connection", function(socket) {
  console.log("A client connected");

  // Create a new room and emit the room ID to the client
  socket.on("createRoom", function(callback) {
    const roomId = uuidv4();
    clients[socket.id] = roomId;
    socket.join(roomId);
    callback(roomId);
  });

  // Join a room and emit the existing comments to the client
  socket.on("joinRoom", function(roomId) {
    clients[socket.id] = roomId;
    socket.join(roomId);
    socket.emit("existingComments", comments);
  });

  // Receive a new comment and emit it to all clients in the same room
  socket.on("newComment", function(comment) {
    const roomId = clients[socket.id];
    comments.push(comment);
    io.to(roomId).emit("newComment", comment);
  });

  // Remove the client from the clients object when disconnected
  socket.on("disconnect", function() {
    console.log("A client disconnected");
    delete clients[socket.id];
  });
});

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);
let io;

const initializeSocket = (server) => {

io = require("socket.io")(server, {
cors: {
origin: "*"
}
});

io.on("connection", (socket) => {

console.log("User connected:", socket.id);

// Join a user-specific room so we can send targeted notifications
socket.on("join", (userId) => {
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  }
});

socket.on("disconnect", () => {
console.log("User disconnected:", socket.id);
});

});

};

const getIO = () => {

if (!io) {
throw new Error("Socket.io not initialized");
}

return io;

};

module.exports = { initializeSocket, getIO };
const { Server } = require("socket.io");
const logger = require("../logger");
const { server } = require("./environment");

// Chat Socket
module.exports.chatSockets = function (socketServer) {
  // Configuring the Server
  try {
    let io = new Server(socketServer, {
      cors: {
        origin: `http://localhost:${server.port}`, //! Needed to allow communication
      },
    });

    // On Connection
    io.on("connection", (socket) => {
      logger.info(`New Connection Received in socket ID : ${socket.id}`);

      // On Disconnection
      socket.on("disconnect", (reason) => {
        logger.info(`Socket ${socket.id} left for reason : ${reason}`);
      });

      // Chat Room
      socket.on("join_room", function (data) {
        logger.info(`User ${data.user_email} joined the chat room`);

        socket.join(data.chatroom);

        // Broadcasting that user joined to chat room
        io.in(data.chatroom).emit("user_joined", data);
      });

      // Broadcast to other devices that a message has been sent
      socket.on("send_message", function (data) {
        io.in(data.chatroom).emit("receive_message", data);
      });
    });
  } catch (err) {
    logger.error(`Error when configuring socket at chat_socket.js : ${err}`);
    return;
  }
};

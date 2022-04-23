//const socketioAuth = require("socketio-auth");
const jwt = require("jsonwebtoken");

const chatIO = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  //auth middleware - not an express middleware here
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token);
    if (!token) {
      const err = new Error("not authorized");
      err.data = { content: "Please retry later" };
      next(err);
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("socket : authorized");
      socket.user = { userId: payload.userId, name: payload.name };
      next();
    } catch (error) {
      const err = new Error("not authorized");
      err.data = { content: "Please retry later" };
      console.log("socket : not authorized");
      next(err);
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket is active to be connected");
    socket.on("chat", (payload) => {
      const user = socket.user;
      console.log(" payload", { ...payload, user });
      io.emit("chat", { ...payload, user });
    });
  });
};

module.exports = chatIO;

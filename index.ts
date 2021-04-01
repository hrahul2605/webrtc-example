import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

const app = express();
const httpServer = createServer(app);
const options = {};
const io = new Server(httpServer, options);

const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "client")));
io.on("connection", (socket: Socket) => {
  let roomID = "";

  socket.on("join", (args) => {
    roomID = args.roomID;
    socket.join(roomID);
  });

  socket.on("sendOffer", (args) => {
    socket.to(roomID).emit("recieveOffer", args);
  });

  socket.on("sendAnswer", (args) => {
    socket.to(roomID).emit("recieveAnswer", args);
  });

  socket.on("sendIceCandidate", (args) => {
    socket.to(roomID).emit("recieveIceCandidates", args);
  });

  socket.on("disconnect", () => {
    socket.removeAllListeners();
  });
});

httpServer.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));

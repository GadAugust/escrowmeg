const express = require("express");
const bodyParser = require("body-parser");
const env = require("./configs/env");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// app.use(express.static("src/public"));
// app.use('/public/profile_pic', express.static('public/profile_pic'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, X-Requested-With, Range, Content-Type"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

io.on("connection", (socket) => {
  console.log(`${socket.id}  user connected`);

  socket.on("remove", () => {
    socket.disconnect();
    console.log(`${socket.id} user disconnected`);
  });

  socket.on("subscribe", (room) => {
    console.log("joining room", room);
    socket.join(room);
  });

  socket.on("unsubscribe", (room) => {
    console.log("leaving room", room);
    socket.leave(room.roomId);
  });

  socket.on("message", (data) => {
    console.log("message", data);
    const room = `room-${data.project_id}`;
    const message = data;
    io.in(room).emit("message", message);
  });
});

server.listen(env.port, function () {
  console.log("app listening at port %s", env.port);
});

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const { timeLog } = require("console");
const port = 3002;
const app = express();

app.use(cors());

const server = http.createServer(app);
// socketio 생성후 서버 인스턴스 사용
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
    socket.on("init",(payload)=>{
        console.log(payload);
    })
  // join : 채팅 참여 이벤트
  socket.on("join", ({ roomName: room, userName: user }) => {
    socket.join(room);
    io.to(room).emit("onConnect", `${user} 님이 입장했습니다.`);
    // send : 클라이언트가 메시지 보내는 이벤트
    // item: {name: String, msg: String, timeStamp: String}
  });
  socket.on("onSend", (messageItem) => {
    io.to("All").emit("onReceive", messageItem);
  });

  socket.on("disConnect", ({userName:user}) => {
    socket.leave("All");
    io.to("All").emit("onDisconnect", `${user} 님이 퇴장하셨습니다.`);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
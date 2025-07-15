import express, { Express } from "express";
import http, { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";

const app: Express = express();
app.use(cors());
const server: HTTPServer = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

type UsersMap = Record<string, string>;
const users: UsersMap = {};

io.on("connection", (socket: Socket) => {
  socket.on("identify", (username: string) => {
    users[username] = socket.id;
  });

  socket.on(
    "message",
    ({ to, from, content }: { to: string; from: string; content: string }) => {
      if (users[to]) {
        io.to(users[to]).emit("message", { from, content });
      }
    }
  );

  socket.on("disconnect", () => {
    for (const [username, id] of Object.entries(users)) {
      if (id === socket.id) {
        delete users[username];
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

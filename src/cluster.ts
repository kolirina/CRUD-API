import cluster from "cluster";
import os from "os";
import http from "http";
import { createServer } from "./server";
import dotenv from "dotenv";

dotenv.config();

const numCPUs = os.cpus().length;
const PORT = Number(process.env.PORT) || 3000;

let userDB: { [key: string]: any } = {};

interface CreateUserMessage {
  type: "createUser";
  data: any;
}

interface GetUserMessage {
  type: "getUser";
  userId: string;
}

interface UserCreatedMessage {
  type: "userCreated";
  userId: string;
}

interface SendUserMessage {
  type: "sendUser";
  user: any;
}

type Message =
  | CreateUserMessage
  | GetUserMessage
  | UserCreatedMessage
  | SendUserMessage;

if (cluster.isPrimary) {
  console.log(`Primary process is running on port ${PORT}`);

  cluster.on("message", (worker, message: Message) => {
    if (message.type === "createUser") {
      const user = message.data;
      const userId = user.id;
      userDB[userId] = user;
      worker.send({ type: "userCreated", userId });
    } else if (message.type === "getUser") {
      const user = userDB[message.userId];
      worker.send({ type: "sendUser", user });
    }
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const server = createServer();

  server.on("request", (req, res) => {
    if (req.method === "POST" && req.url === "/users") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const userData = JSON.parse(body);
        const message: CreateUserMessage = {
          type: "createUser",
          data: userData,
        };
        process.send!(message);
        process.on("message", (message: Message) => {
          if (message.type === "userCreated") {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ userId: message.userId }));
          }
        });
      });
    } else if (req.method === "GET" && req.url!.startsWith("/users/")) {
      const userId = req.url!.split("/")[2];
      const message: GetUserMessage = { type: "getUser", userId };
      process.send!(message);
      process.on("message", (message: Message) => {
        if (message.type === "sendUser") {
          if (message.user) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message.user));
          } else {
            res.writeHead(404);
            res.end("User not found");
          }
        }
      });
    }
  });

  server.listen(PORT, () => {
    console.log(`Worker process ${process.pid} is listening on port ${PORT}`);
  });
}

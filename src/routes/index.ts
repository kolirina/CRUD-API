import { IncomingMessage, ServerResponse } from "http";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users";

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (url === "/api/users" && method === "GET") {
    return getUsers(req, res);
  } else if (url && url.startsWith("/api/users/") && method === "GET") {
    const userId = url.split("/")[3];
    return getUserById(req, res, userId);
  } else if (url === "/api/users" && method === "POST") {
    return createUser(req, res);
  } else if (url && url.startsWith("/api/users/") && method === "PUT") {
    const userId = url.split("/")[3];
    return updateUser(req, res, userId);
  } else if (url && url.startsWith("/api/users/") && method === "DELETE") {
    const userId = url.split("/")[3];
    return deleteUser(req, res, userId);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
};

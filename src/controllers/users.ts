import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4 } from "uuid";
import { users } from "../models/users";
import { parseBody } from "../services/utils";

// Получить всех пользователей
export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};

// Получить пользователя по ID
export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not found" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  }
};

// Создать пользователя
export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await parseBody(req);

  const newUser = {
    id: uuidv4(),
    username: body.username,
    age: body.age,
    hobbies: body.hobbies || [],
  };

  users.push(newUser);
  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(newUser));
};

// Обновить пользователя
export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not found" }));
  } else {
    const body = await parseBody(req);
    user.username = body.username || user.username;
    user.age = body.age || user.age;
    user.hobbies = body.hobbies || user.hobbies;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  }
};

// Удалить пользователя
export const deleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not found" }));
  } else {
    users.splice(userIndex, 1);
    res.writeHead(204, { "Content-Type": "application/json" });
    res.end();
  }
};

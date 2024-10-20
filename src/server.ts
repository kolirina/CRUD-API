import http from "http";
import { routes } from "./routes";

export const createServer = () => {
  return http.createServer((req, res) => {
    routes(req, res);
  });
};

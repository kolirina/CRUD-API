import cluster from "cluster";
import os from "os";
import http from "http";
import { createServer } from "./server";
import dotenv from "dotenv";

dotenv.config();

const numCPUs = os.cpus().length;

const PORT = Number(process.env.PORT) || 3000;

if (cluster.isPrimary) {
  let currentWorker = 0;

  console.log(`Primary process is running on port ${PORT}`);

  const loadBalancer = http.createServer((req, res) => {
    currentWorker = (currentWorker + 1) % numCPUs;
    const workerPort = PORT + 1 + currentWorker;

    const options = {
      hostname: "localhost",
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode!, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer is running on port ${PORT}`);
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ WORKER_PORT: PORT + 1 + i });
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  const workerPort = process.env.WORKER_PORT;
  const server = createServer();

  server.on("request", (req, res) => {
    console.log(`Worker ${process.pid} handling request for ${req.url}`);
  });

  server.listen(workerPort, () => {
    console.log(
      `Worker process ${process.pid} is listening on port ${workerPort}`
    );
  });
}

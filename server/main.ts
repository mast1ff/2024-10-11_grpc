import "dotenv/config";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { GreeterService } from "../services/hello/hello_grpc_pb";
import { TaskManagerService } from "../services/tasks/tasks_grpc_pb";
import { TaskManagerServer } from "./tasks";
import { GreeterServer } from "./hello";

const bootstrap = async () => {
  const client = createClient({ url: process.env.DB_FILE_NAME! });
  const db = drizzle(client);
  const server = new Server();

  // @ts-ignore
  server.addService(GreeterService, new GreeterServer());
  // @ts-ignore
  server.addService(TaskManagerService, new TaskManagerServer(db));

  server.bindAsync("0.0.0.0:9000", ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Server listening on ${port}`);
  });
};

bootstrap();

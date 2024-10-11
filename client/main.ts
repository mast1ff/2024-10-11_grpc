import { credentials } from "@grpc/grpc-js";
import { GreeterClient } from "../hello/hello_grpc_pb";
import { HelloRequest, HelloReply } from "../hello/hello_pb";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const createClient = () => {
  return new GreeterClient("localhost:9000", credentials.createInsecure());
};

const app = new Hono();

app
  .get("/hello", async (ctx) => {
    ctx.header("Content-Type", "text/html");
    ctx.status(200);
    return ctx.html(
      `<h1>Hello, ...?</h1>
    <form action="/hello" method="post">
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>`
    );
  })
  .post("/hello", async (ctx) => {
    const client = createClient();
    const request = new HelloRequest();

    const payload = await ctx.req.parseBody();
    request.setName(payload.name as string);

    const response = await new Promise<HelloReply>((resolve, reject) => {
      client.sayHello(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    ctx.header("Content-Type", "text/html");
    ctx.status(200);
    return ctx.html(
      `<h1>Hello, ${response.getMessage()}</h1>
    <form action="/hello" method="post">
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>`
    );
  });

serve(app, (info) => {
  console.log(`Client server listening on http://localhost:${info.port}`);
});

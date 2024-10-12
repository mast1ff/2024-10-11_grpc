import { Hono } from "hono";
import { credentials } from "@grpc/grpc-js";
import { GreeterClient } from "../services/hello/hello_grpc_pb";
import { HelloRequest, HelloReply } from "../services/hello/hello_pb";
import { html } from "hono/html";
import { layout } from "./layout";

const createClient = () => {
  return new GreeterClient("localhost:9000", credentials.createInsecure());
};

const app = new Hono();

app
  .get("/", async (ctx) => {
    ctx.header("Content-Type", "text/html");
    ctx.status(200);
    return ctx.html(
      layout(
        html`<h1>Hello, ...?</h1>
          <form action="/hello" method="post">
            <input type="text" name="name" />
            <button type="submit">Submit</button>
          </form>`,
      ),
    );
  })
  .post("/", async (ctx) => {
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
      layout(
        html`<h1>Hello, ${response.getMessage()}</h1>
          <form action="/hello" method="post">
            <input type="text" name="name" />
            <button type="submit">Submit</button>
          </form>`,
      ),
    );
  });

export const hello = app;

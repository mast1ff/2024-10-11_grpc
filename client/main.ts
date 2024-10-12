import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { hello } from "./hello";
import { layout } from "./layout";
import { html } from "hono/html";
import { tasks } from "./tasks";

const app = new Hono();

app.route("/hello", hello);
app.route("/tasks", tasks);

app.get("/", async (ctx) => {
  return ctx.html(
    layout(
      html`<h1>gRPC App</h1>
        <a href="/hello">Hello</a>
        <a href="/tasks">Tasks</a>`,
    ),
  );
});

serve(app, (info) => {
  console.log(`Client server listening on http://localhost:${info.port}`);
});

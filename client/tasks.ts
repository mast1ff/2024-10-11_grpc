import { Hono } from "hono";
import { html } from "hono/html";
import { credentials } from "@grpc/grpc-js";
import { TaskManagerClient } from "../services/tasks/tasks_grpc_pb";
import { layout } from "./layout";
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  Task,
  UpdateTaskRequest,
} from "../services/tasks/tasks_pb";

const createClient = () => {
  return new TaskManagerClient("localhost:9000", credentials.createInsecure());
};

const app = new Hono();

function int(value: any, def: number): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return def;
  }

  if (Number.isNaN(Number.parseInt(value))) {
    return def;
  }

  return Number.parseInt(value);
}

app
  .get("/", async (ctx) => {
    const client = createClient();
    const request = new ListTasksRequest();
    const page = int(ctx.req.query("page"), 1);

    request.setPage(page);
    request.setPagesize(10);

    const response = await new Promise<ListTasksResponse>((resolve, reject) => {
      client.listTasks(request, (err, response) => {
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
        html`<h1>Tasks</h1>
          <ul>
            ${response.getTasksList().map(
              (task) =>
                html`<li>
                  <form id="delete-${task.getId()}" action="/tasks/${task.getId()}/delete" method="get"></form>
                  <form action="/tasks/${task.getId()}" method="post">
                    <div style="display: flex;">
                      <input type="checkbox" name="completed" ${task.getCompleted() ? "checked" : ""} />
                      <input type="hidden" name="title" value="${task.getTitle()}" />
                      <input type="hidden" name="description" value="${task.getDescription()}" />
                      <div style="flex-grow: 1;">
                        <h2>${task.getTitle()}</h2>
                        <p>${task.getDescription()}</p>
                      </div>
                      <button type="submit">Update</button>
                      <button form="delete-${task.getId()}" type="submit">Delete</button>
                    </div>
                  </form>
                </li>`,
            )}
          </ul>
          <form action="/tasks" method="post">
            <div>
              <label for="title">Title</label>
              <input type="text" name="title" id="title" />
            </div>
            <div>
              <label for="description">Description</label>
              <textarea name="description" id="description"></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>`,
      ),
    );
  })
  .post("/", async (ctx) => {
    const payload = await ctx.req.parseBody();

    const client = createClient();
    const request = new CreateTaskRequest();
    request.setTitle(payload.title as string);
    request.setDescription(payload.description as string);

    const task = await new Promise<Task>((resolve, reject) => {
      client.createTask(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    ctx.status(302);
    return ctx.redirect("/tasks");
  })
  .post("/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const payload = await ctx.req.parseBody();

    const client = createClient();
    const request = new UpdateTaskRequest();
    request.setId(int(id, 0));
    request.setTitle(payload.title as string);
    request.setDescription(payload.description as string);
    request.setCompleted(payload.completed === "on");

    await new Promise<void>((resolve, reject) => {
      client.updateTask(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    ctx.status(302);
    return ctx.redirect("/tasks");
  })
  .get("/:id/delete", async (ctx) => {
    const id = ctx.req.param("id");

    const client = createClient();
    const request = new DeleteTaskRequest();
    request.setId(int(id, 0));

    await new Promise<void>((resolve, reject) => {
      client.deleteTask(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    ctx.status(302);
    return ctx.redirect("/tasks");
  });

export const tasks = app;

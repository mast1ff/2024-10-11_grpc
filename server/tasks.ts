import { eq } from "drizzle-orm";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import type { sendUnaryData, ServerUnaryCall, UntypedHandleCall } from "@grpc/grpc-js";
import type { ITaskManagerServer } from "../services/tasks/tasks_grpc_pb";
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  Task,
  UpdateTaskRequest,
} from "../services/tasks/tasks_pb";
import { tasks, TaskSchema } from "../db/schema";

export class TaskManagerServer implements ITaskManagerServer {
  // @ts-ignore
  private db: LibSQLDatabase;

  [name: string]: UntypedHandleCall;

  constructor(db: LibSQLDatabase) {
    this.db = db;
  }

  public async createTask(
    call: ServerUnaryCall<CreateTaskRequest, Task>,
    callback: sendUnaryData<Task>,
  ): Promise<void> {
    const [task] = await this.db
      .insert(tasks)
      .values({
        title: call.request.getTitle(),
        description: call.request.getDescription(),
        created: new Date(),
      })
      .returning();

    if (!task) {
      callback(new Error("Failed to create task"));
      return;
    }

    const reply = new Task();
    reply.setId(task.id);
    reply.setTitle(task.title);
    reply.setDescription(task.description);
    reply.setCompleted(task.completed);
    reply.setCreated(task.created.getTime());
    callback(null, reply);
  }

  public async getTask(call: ServerUnaryCall<GetTaskRequest, Task>, callback: sendUnaryData<Task>): Promise<void> {
    const [task] = await this.db.select().from(tasks).where(eq(tasks.id, call.request.getId())).limit(1);

    if (!task) {
      callback(new Error("Task not found"));
      return;
    }

    const reply = new Task();
    reply.setId(task.id);
    reply.setTitle(task.title);
    reply.setDescription(task.description);
    reply.setCompleted(task.completed);
    reply.setCreated(task.created.getTime());
    callback(null, reply);
  }

  public async listTasks(
    call: ServerUnaryCall<ListTasksRequest, ListTasksResponse>,
    callback: sendUnaryData<ListTasksResponse>,
  ): Promise<void> {
    const page = call.request.getPage();
    const pageSize = call.request.getPagesize();

    let taskList: TaskSchema[];
    if (page && pageSize) {
      taskList = await this.db
        .select()
        .from(tasks)
        .limit(pageSize)
        .offset(page - 1 * pageSize);
    } else {
      taskList = await this.db.select().from(tasks).all();
    }

    const reply = new ListTasksResponse();
    reply.setTasksList(
      taskList.map((task) => {
        const reply = new Task();
        reply.setId(task.id);
        reply.setTitle(task.title);
        reply.setDescription(task.description);
        reply.setCompleted(task.completed);
        reply.setCreated(task.created.getTime());
        return reply;
      }),
    );

    callback(null, reply);
  }

  public async updateTask(
    call: ServerUnaryCall<UpdateTaskRequest, Task>,
    callback: sendUnaryData<Task>,
  ): Promise<void> {
    const [task] = await this.db
      .update(tasks)
      .set({
        title: call.request.getTitle(),
        description: call.request.getDescription(),
        completed: call.request.getCompleted(),
        updated: new Date(),
      })
      .where(eq(tasks.id, call.request.getId()))
      .returning();

    if (!task) {
      callback(new Error("Task not found"));
      return;
    }

    const reply = new Task();
    reply.setId(task.id);
    reply.setTitle(task.title);
    reply.setDescription(task.description);
    reply.setCompleted(task.completed);
    reply.setCreated(task.created.getTime());
    callback(null, reply);
  }

  public async deleteTask(
    call: ServerUnaryCall<DeleteTaskRequest, Task>,
    callback: sendUnaryData<Task>,
  ): Promise<void> {
    const [task] = await this.db.delete(tasks).where(eq(tasks.id, call.request.getId())).returning();

    if (!task) {
      callback(new Error("Task not found"));
      return;
    }

    const reply = new Task();
    reply.setId(task.id);
    reply.setTitle(task.title);
    reply.setDescription(task.description);
    reply.setCompleted(task.completed);
    reply.setCreated(task.created.getTime());
    callback(null, reply);
  }
}

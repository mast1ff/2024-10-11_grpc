import type { sendUnaryData, ServerUnaryCall, UntypedHandleCall } from "@grpc/grpc-js";
import { IGreeterServer } from "../services/hello/hello_grpc_pb";
import { HelloReply, HelloRequest } from "../services/hello/hello_pb";

export class GreeterServer implements IGreeterServer {
  [name: string]: UntypedHandleCall;

  public sayHello(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>): void {
    const reply = new HelloReply();
    reply.setMessage(call.request.getName());

    callback(null, reply);
  }
}

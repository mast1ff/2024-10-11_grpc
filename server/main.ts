import {
  sendUnaryData,
  Server,
  ServerCredentials,
  ServerUnaryCall,
  type UntypedHandleCall,
} from "@grpc/grpc-js";
import { GreeterService, IGreeterServer } from "../hello/hello_grpc_pb";
import { HelloReply, HelloRequest } from "../hello/hello_pb";

const bootstrap = () => {
  const server = new Server();

  // @ts-ignore
  server.addService(GreeterService, new GreeterServer());

  server.bindAsync(
    "0.0.0.0:9000",
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Server listening on ${port}`);
    }
  );
};

class GreeterServer implements IGreeterServer {
  [name: string]: UntypedHandleCall;

  public sayHello(
    call: ServerUnaryCall<HelloRequest, HelloReply>,
    callback: sendUnaryData<HelloReply>
  ): void {
    const reply = new HelloReply();
    reply.setMessage(call.request.getName());

    callback(null, reply);
  }
}

bootstrap();

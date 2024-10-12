import { resolve } from "node:path";
import { $ } from "zx";

const protocToolPath = resolve(process.cwd(), "node_modules/.bin/grpc_tools_node_protoc");
const protocGenTs = resolve(process.cwd(), "node_modules/.bin/protoc-gen-ts");

$`${protocToolPath} \
  --plugin=protoc-gen-ts=${protocGenTs} \
  --js_out=import_style=commonjs,binary:. \
  --grpc_out=grpc_js:. \
  --ts_out=service=grpc-node,mode=grpc-js:. \
  -I . \
  services/**/*.proto`;

.PHONY: setup
setup:
	./node_modules/.bin/grpc_tools_node_protoc \
		--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
		--js_out=import_style=commonjs,binary:. \
		--grpc_out=grpc_js:. \
		--ts_out=service=grpc-node,mode=grpc-js:. \
		-I . \
		hello/*.proto

.PHONY: clean
clean:
	rm -f hello/*pb.{d.ts,js}

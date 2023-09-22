import { FileDescriptorProto } from "@bufbuild/protobuf";

export default function FileDescriptorToJSONSchema(desc: FileDescriptorProto): object {
    let result = {
        "$schema": "http://json-schema.org/draft-07/schema",
        "definitions": {}
    }
    return result
}

import { FileDescriptorProto } from "@bufbuild/protobuf";
import { messageRef } from "./message-descriptor";
import _ from "lodash";

export default function fileDescriptorToJSONSchema(desc: FileDescriptorProto): any {
    let result = {
        "$schema": "http://json-schema.org/draft-07/schema",
        "definitions":
            _(desc.messageType)
                .map(m => messageRef(m))
                .map(m => [m.title, m])
                .fromPairs()
                .value()
    }

    return result
}

import { FileDescriptorProto } from "@bufbuild/protobuf";
import { messageDefinition as messageDefinition } from "./message-descriptor";
import _ from "lodash";
import root from "./root";

export default function fileDescriptorToJSONSchema(desc: FileDescriptorProto): any {
    return _.assign(root, fileDefinition(desc))
}

// converts to a ref
export function fileDefinition(desc: FileDescriptorProto): any {
    let definitions = _(desc.messageType)
        .map(m => messageDefinition(m))
        .map(m => [m.title, m])
        .fromPairs()

    return {
        "$schema": "http://json-schema.org/draft-07/schema",
        "definitions": definitions.value(),
        "oneOf": definitions
            .keys()
            .map(k => ({ "$ref": `#/definitions/${k}` }))
            .value()
    }
}

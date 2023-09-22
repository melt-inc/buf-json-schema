import { DescriptorProto } from "@bufbuild/protobuf";
import _ from "lodash";

export default function descriptorToJSONSchema(desc: DescriptorProto): any {
    let result = {
        "$schema": "http://json-schema.org/draft-07/schema",
    }
    return _.assign(result, messageRef(desc))
}

// converts to a ref
export function messageRef(desc: DescriptorProto): any {
    let result = {
        "title": desc.name ?? "UnknownMessage",
        "type": "object"
    }
    return result
}

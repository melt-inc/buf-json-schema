import { DescriptorProto } from "@bufbuild/protobuf";

export default function DescriptorToJSONSchema(desc: DescriptorProto): object {
    let result = {
        "$schema": "http://json-schema.org/draft-07/schema",
        "title": desc.name ?? "UnknownMessage",
        "type": "object"
    }
    return result
}

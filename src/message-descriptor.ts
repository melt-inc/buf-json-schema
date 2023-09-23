import { DescriptorProto } from "@bufbuild/protobuf";
import _ from "lodash";

import root from "./root";
import { fieldDefinition } from "./field-descriptor";

export default function descriptorToJSONSchema(desc: DescriptorProto): any {
    return _.assign(root, messageDefinition(desc))
}

// converts to a ref
export function messageDefinition(desc: DescriptorProto): any {
    let properties = _(desc.field)
        .map(f => fieldDefinition(f))
        .map(f => [f.title, f])
        .fromPairs()
        .value()

    return {
        "title": desc.name ?? "UnknownMessage",
        "type": "object",
        "properties": properties,
    }
}

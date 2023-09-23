import { FieldDescriptorProto } from "@bufbuild/protobuf";
import _ from "lodash";
import root from "./root";
import { types, isComplexType, isRepeatedType } from "./types";

export default function fieldDescriptorToJSONSchema(proto: FieldDescriptorProto): any {
    return _.assign(root, fieldDefinition(proto))
}

// converts to a ref
export function fieldDefinition(proto: FieldDescriptorProto): any {
    let result: any = {
        title: title(proto)
    }

    if (isComplexType(proto)) {
        // TODO handle complex types
    }

    let t = types[proto.type ?? 0];

    if (isRepeatedType(proto)) {
        result["type"] = "array";
        result["items"] = t;
    } else {
        _.assign(result, t);
    }

    return result
}

function title(proto: FieldDescriptorProto): string {
    return proto.jsonName ?? proto.name ?? "UnknownField"
}

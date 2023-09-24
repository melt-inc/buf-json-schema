import { DescriptorSet, FieldDescriptorProto, FieldDescriptorProto_Type } from "@bufbuild/protobuf";
import _ from "lodash";
import root from "./root";
import { types, isComplexType, isRepeatedType, tryWellKnown } from "./types";
import messageDefinition from "./message-descriptor";

// Returns the JSON Schema for a field descriptor. If a descriptor set is also
// provided, it will be used to resolve references to other types.
export default function fieldDescriptorToJSONSchema(proto: FieldDescriptorProto, descriptors: DescriptorSet | undefined): any {
    let result = fieldDefinition(proto);

    // if the result contains a ref, try to resolve it from the descriptor set
    if (result["$ref"] && descriptors?.messages) {
        let ref = result["$ref"];
        let name = ref.split("/").pop()!;
        let message = descriptors.messages.get(name);
        if (message) {
            result["definitions"] = {
                [name]: messageDefinition(message.proto)
            }
        }
    }

    return _.assign(root, )
}

// converts to a ref
export function fieldDefinition(proto: FieldDescriptorProto): any {
    let result: any = {
        title: title(proto)
    }

    // try well known types first
    let t = tryWellKnown(proto)

    if (isComplexType(proto)) {
        // TODO handle other complex types
        if (proto.type === FieldDescriptorProto_Type.MESSAGE) {
            t = { "$ref": `#/definitions/${typeName(proto)}` }
        }
    }

    if (t === null) {
        t = types[proto.type ?? 0];
    }

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

function typeName(proto: FieldDescriptorProto): string {
    let name = proto.typeName;
    if (name?.startsWith(".")) {
        return name.substring(1);
    }
    return name ?? "UnknownType"
}

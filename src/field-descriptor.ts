import { DescriptorSet, FieldDescriptorProto, FieldDescriptorProto_Type } from "@bufbuild/protobuf";
import _ from "lodash";
import { types, isComplexType, isRepeatedType, tryWellKnown, typeName } from "./field-types";
import { messageSchema } from "./message-descriptor";
import { enumSchema } from "./enum-descriptor";

// Returns the JSON Schema for a field descriptor. If a descriptor set is also
// provided, it will be used to resolve references to other types.
export function fieldDescriptorToJSONSchema(proto: FieldDescriptorProto, descriptors: DescriptorSet | undefined): any {
    let [result, unresolved] = fieldSchema(proto);

    // if the result contains a ref, try to resolve it from the descriptor set
    if (unresolved) {
        let message = descriptors?.messages.get(unresolved);
        if (message) {
            result["definitions"] = {
                [unresolved]: messageSchema(message.proto)
            }
        }
        else {
            let enm = descriptors?.enums.get(unresolved);
            if (enm) {
                result["definitions"] = {
                    [unresolved]: enumSchema(enm)
                }
            }
        }
    }

    return _.assign({"$schema": "http://json-schema.org/draft-07/schema"}, result)
}

// creates a JSON Schema for a field descriptor. Returns the schema and if the
// field is a complex type, the name of the type that needs to be resolved.
export function fieldSchema(proto: FieldDescriptorProto): [any, string] {
    let unresolved: string = "";
    let result: any = {
        title: title(proto)
    }

    // try well known types first
    let t = tryWellKnown(proto)

    if (!t && isComplexType(proto)) {
        // TODO handle other complex types
        if (proto.type === FieldDescriptorProto_Type.MESSAGE) {
            t = { "$ref": `#/definitions/${typeName(proto)}` }
        }
        else if (proto.type === FieldDescriptorProto_Type.ENUM) {
            t = {
                "oneOf": [
                    {"$ref": `#/definitions/${typeName(proto)}_strings`},
                    {"$ref": `#/definitions/${typeName(proto)}_values`}
                ]
            }
        }
        unresolved = typeName(proto);
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

    return [result, unresolved];
}

function title(proto: FieldDescriptorProto): string {
    return proto.jsonName ?? proto.name ?? "UnknownField"
}

import { DescEnum } from "@bufbuild/protobuf";
import _ from "lodash";

export function enumToJSONSchema(proto: DescEnum): any {
    return {
        "$schema": "http://json-schema.org/draft-07/schema",
        "definitions": enumSchema(proto)
    }
}

// creates a JSON Schema for a message descriptor. Returns the schema and a set
// of definitions that could not be resolved and should be hoisted to the top
// for resolution.
export function enumSchema(proto: DescEnum): any {
    const name = enumName(proto);
    return {
        [`${name}_strings`]: {
            "title": "examples.SimpleEnum_strings",
            "type": "string",
            "enum": ["Unknown", "Yes", "No"]
        },
        [`${name}_values`]: {
            "title": "examples.SimpleEnum_values",
            "type": "integer",
            "enum": [0, 1, 2]
        },
    }
}

function enumName(proto: DescEnum): string {
    let name = proto.typeName;
    if (name?.startsWith(".")) {
        return name.substring(1);
    }
    return name ?? "UnknownEnum";
}

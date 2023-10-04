import { DescriptorProto, DescriptorSet } from "@bufbuild/protobuf";
import _ from "lodash";
import { fieldSchema } from "./field-descriptor";
import { enumSchema } from "./enum-descriptor";

export function messageToJSONSchema(proto: DescriptorProto, descriptors?: DescriptorSet): any {
    let [message, unresolved] = messageSchema(proto);
    let definitions: any = {}

    while (descriptors && unresolved.size > 0) {
        let title: string = unresolved.values().next().value;
        let m = descriptors?.messages.get(title)?.proto;

        if (m) {
            let [schema, innerUnresolved] = messageSchema(m);
            _.assign(definitions, { [title]: schema });

            // iterate over innerUnresolved
            for (let u of innerUnresolved) {
                // if it's not in definitions, then it really is unresolved
                if (definitions[u] == undefined) {
                    unresolved.add(u);
                }
            }
        } else {
            let enm = descriptors?.enums.get(title);
            if (enm) {
                _.assign(definitions, enumSchema(enm));
            }
        }

        unresolved.delete(title);
    }

    return _.assign({"$schema": "http://json-schema.org/draft-07/schema"}, message, {"definitions": definitions})
}

// creates a JSON Schema for a message descriptor. Returns the schema and a set
// of definitions that could not be resolved and should be hoisted to the top
// for resolution.
export function messageSchema(proto: DescriptorProto): [any, Set<string>] {
    let unresolved = new Set<string>()

    let properties = _(proto.field)
        .map(f => fieldSchema(f))
        .map(([f, u]) => {
            if (u) unresolved.add(u);
            return f;
        })
        .map(f => [f.title, f])
        .fromPairs()
        .value()

    return [{
        "title": messageName(proto),
        "type": "object",
        "properties": properties,
    }, unresolved]
}

function messageName(proto: DescriptorProto): string {
    let name = proto.name;
    if (name?.startsWith(".")) {
        return name.substring(1);
    }
    return name ?? "UnknownMessage";
}

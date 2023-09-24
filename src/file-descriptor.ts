import { DescriptorSet, FileDescriptorProto } from "@bufbuild/protobuf";
import { messageSchema } from "./message-descriptor";
import _ from "lodash";
import root from "./root";

export function fileToJSONSchema(proto: FileDescriptorProto, descriptors?: DescriptorSet): any {
    let [file, unresolved] = fileSchema(proto);

    while (unresolved.size > 0) {
        let next: string = unresolved.values().next().value;
        let title = next.split("/").pop()!;
        let m = descriptors?.messages.get(title)!.proto!;
        let [schema, innerUnresolved] = messageSchema(m);
        _.assign(file["definitions"], { [next]: schema });

        // iterate over innerUnresolved
        for (let u of innerUnresolved) {
            // if it's not in definitions, then it really is unresolved
            if (file["definitions"][u] == undefined) {
                unresolved.add(u);
            }
        }
        unresolved.delete(next);
    }

    return _.assign(root, )
}

// converts to a ref
function fileSchema(desc: FileDescriptorProto): [any, Set<string>] {
    let unresolved = new Set<string>();
    let definitions: any = {};
    for (let m of desc.messageType) {
        let [schema, innerUnresolved] = messageSchema(m);
        unresolved = new Set<string>(...unresolved, ...innerUnresolved)
        definitions[m.name!] = schema;
    }

    _(definitions).keys().each(k => unresolved.delete(k))

    return [{
        "definitions": definitions,
        "oneOf": definitions
            .keys()
            .map((k: string) => ({ "$ref": `#/definitions/${k}` }))
    }, unresolved]
}

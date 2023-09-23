import { FieldDescriptorProto_Type, FieldDescriptorProto_Label, FieldDescriptorProto } from "@bufbuild/protobuf";

export let types: any = {}

types[FieldDescriptorProto_Type.STRING] = { type: "string" };

export function isComplexType(proto: FieldDescriptorProto): boolean {
    return (!!proto.typeName) || (
        proto.type === FieldDescriptorProto_Type.GROUP ||
        proto.type === FieldDescriptorProto_Type.MESSAGE ||
        proto.type === FieldDescriptorProto_Type.ENUM
    )
}

export function isRepeatedType(proto: FieldDescriptorProto): boolean {
    return proto.label === FieldDescriptorProto_Label.REPEATED;
}

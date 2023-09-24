// Utilities for working with protobuf types

import { FieldDescriptorProto_Type, FieldDescriptorProto_Label, FieldDescriptorProto } from "@bufbuild/protobuf";

// JSON Schema types for protobuf scalar types
export let types: any = {}

types[FieldDescriptorProto_Type.DOUBLE] = { type: 'number' }
types[FieldDescriptorProto_Type.FLOAT] = { type: 'number' }
types[FieldDescriptorProto_Type.INT64] = { type: 'integer' }
types[FieldDescriptorProto_Type.UINT64] = { type: 'integer', minimum: 0 }
types[FieldDescriptorProto_Type.INT32] = { type: 'integer' }
types[FieldDescriptorProto_Type.FIXED64] = { type: 'number' }
types[FieldDescriptorProto_Type.FIXED32] = { type: 'number' }
types[FieldDescriptorProto_Type.BOOL] = { type: 'boolean' }
types[FieldDescriptorProto_Type.STRING] = { type: 'string' }
types[FieldDescriptorProto_Type.BYTES] = { type: 'string' }
types[FieldDescriptorProto_Type.UINT32] = { type: 'integer', minimum: 0 }
// different encoding of the same types
types[FieldDescriptorProto_Type.SFIXED32] = types[FieldDescriptorProto_Type.FIXED32]
types[FieldDescriptorProto_Type.SFIXED64] = types[FieldDescriptorProto_Type.FIXED64]
types[FieldDescriptorProto_Type.SINT32] = types[FieldDescriptorProto_Type.INT32]
types[FieldDescriptorProto_Type.SINT64] = types[FieldDescriptorProto_Type.INT64]

// Returns true if the field is complex (i.e. not a scalar)
export function isComplexType(proto: FieldDescriptorProto): boolean {
    return (!!proto.typeName) || (
        proto.type === FieldDescriptorProto_Type.GROUP ||
        proto.type === FieldDescriptorProto_Type.MESSAGE ||
        proto.type === FieldDescriptorProto_Type.ENUM
    )
}

// Returns true if the field is repeated
export function isRepeatedType(proto: FieldDescriptorProto): boolean {
    return proto.label === FieldDescriptorProto_Label.REPEATED;
}

// Well known types are treated special in their JSON representation.
export function tryWellKnown(proto: FieldDescriptorProto): any {
    switch (proto.typeName) {
        case ".google.protobuf.BoolValue":
            return types[FieldDescriptorProto_Type.BOOL];
        case ".google.protobuf.StringValue":
        case ".google.protobuf.BytesValue":
            return types[FieldDescriptorProto_Type.STRING];
        case ".google.protobuf.DoubleValue":
            return types[FieldDescriptorProto_Type.DOUBLE];
        case ".google.protobuf.Duration":
            return { type: "string", pattern: "^(-?)\\d+(\\.\\d+)?s$" };
            // return {
            //     oneOf: [
            //         { type: "string", pattern: "^(-?)\\d+(\\.\\d+)?s$" },
            //         { type: "object", properties: { seconds: { type: "integer" }, nanos: { type: "integer" } } }
            //     ]
            // }
        case ".google.protobuf.FloatValue":
            return types[FieldDescriptorProto_Type.FLOAT];
        case ".google.protobuf.Int32Value":
            return types[FieldDescriptorProto_Type.INT32];
        case ".google.protobuf.Int64Value":
            return types[FieldDescriptorProto_Type.INT64];
        case ".google.protobuf.ListValue":
            return { type: "array" }
        case ".google.protobuf.Struct":
            return { "type": "object" };
        case ".google.protobuf.UInt32Value":
            return types[FieldDescriptorProto_Type.UINT32];
        case ".google.protobuf.UInt64Value":
            return types[FieldDescriptorProto_Type.UINT64];
        case ".google.protobuf.Value":
            return {
                oneOf: [
                    { type: 'array'},
                    { type: 'boolean' },
                    { type: 'integer' },
                    { type: 'number' },
                    { type: 'object' },
                    { type: 'string' }
                ]
            };

    }
    return null;
}

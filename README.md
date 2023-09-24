# Protobuf to JSON Schema

Convert Protobuf descriptors to JSON Schema.

## API

> [!WARNING]
> API is currently in Alpha and is subject to breaking changes.

### messageToJSONSchema
`messageToJSONSchema(proto: DescriptorProto, descriptors?: DescriptorSet): any`

Creates a JSON Schema from the given `DescriptorProto`. If a `DescriptorSet` is also given, it will be used to resolve any references to other types.

### fileToJSONSchema
`fileDescriptorToJSONSchema(proto: FileDescriptorProto, descriptors?: DescriptorSet): any`

Creates a JSON Schema from the given `FileDescriptorProto`. If a `DescriptorSet` is also given, it will be used to resolve any references to other types. Every message type in the file descriptor will exist in the JSON Schema `definitions` section, and a `oneOf` constraint will ensure only one message matches validation. See test for some examples.

### Example usage
#### Getting a descriptor
You can load a descriptor set from binary or JSON.
```ts
import { FileDescriptorSet, createDescriptorSet } from "@bufbuild/protobuf";

// load descriptors from file (or anywhere)
const buffer = fs.readFileSync("test/example-descriptors.bin");
const fileDescriptors = FileDescriptorSet.fromBinary(buffer)

// create descriptor set
let descriptorSet = createDescriptorSet(fileDescriptors);

// get message descriptor
let messageDescriptor = descriptorSet.messages.get("mypackage.MyProtoMessage")
```

Then import `proto-json-schema` and use the relevant top-level function:

```ts
import { messageDescriptor } from "@melt-inc/proto-json-schema"
let schema = messageToJSONSchema(messageDescriptor.proto, descriptorSet)
```


#### TypeScript Extension Methods

For convenience, the `.toJSONSchema()` module augmentation is available on Buf descriptor classes.

```ts
import "@melt-inc/proto-json-schema/extensions"

// use extension method              ↓↓↓↓↓↓↓↓↓↓↓↓
let schema = messageDescriptor.proto.toJSONSchema(descriptorSet)
```


## Progress
Currently only a subset of valid protobuf definitions are supported. Track the progress of development below:

- [x] Resolve references from descriptor set
- [x] Message
- [x] File
    - [ ] Tests
- [ ] Enum
- [x] Field
    - [x] Scalar
    - [x] Messages
    - [x] Repeated
        - [ ] Tests
    - [ ] Enum
    - [ ] Maps
    - [ ] Group ([deprecated in proto3](https://protobuf.dev/reference/protobuf/proto2-spec/#group_field))
- [x] [Well Known](https://protobuf.dev/reference/protobuf/google.protobuf/)
    - [ ] Any (message)
    - [x] BoolValue (message)
    - [ ] BytesValue (message)
    - [x] DoubleValue (message)
    - [x] Duration (message)
    - [ ] Empty (message)
    - [ ] Enum (message)
    - [ ] EnumValue (message)
    - [ ] FieldMask (message)
    - [x] FloatValue (message)
    - [x] Int32Value (message)
    - [x] Int64Value (message)
    - [x] ListValue (message)
    - [ ] NullValue (enum)
    - [x] StringValue (message)
    - [x] Struct (message)
    - [ ] Timestamp (message)
    - [x] UInt32Value (message)
    - [x] UInt64Value (message)
    - [x] Value (message)
- [ ] Future features
    - [ ] [protovalidate](https://github.com/bufbuild/protovalidate) / [protoc-gen-validate](https://github.com/bufbuild/protoc-gen-validate) constraints

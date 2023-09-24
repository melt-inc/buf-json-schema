# Protobuf to JSON Schema

Convert Protobuf descriptors to JSON Schema.

## API

> [!WARNING]
> API is currently in Alpha and is subject to breaking changes.





### TypeScript Extension Methods

For convenience, the `.toJSONSchema()` module augmentation is available on Buf descriptor classes.

```ts
// import extension methods
import "@melt-inc/proto-json-scheam/extensions"

// load descriptors from file (or anywhere)
const buffer = fs.readFileSync("test/example-descriptors.bin");
const fileDescriptors = FileDescriptorSet.fromBinary(buffer)

// create descriptor set
let descriptorSet = createDescriptorSet(fileDescriptors);

// get message descriptor
let messageDescriptor = descriptorSet.messages.get("mypackage.MyProtoMessage")

// use extension method              ↓↓↓↓↓↓↓↓↓↓↓↓
let schema = messageDescriptor.proto.toJSONSchema(descriptorSet)
``````


## Progress

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
    - [ ] [protovalidate](https://github.com/bufbuild/protovalidate) constraints

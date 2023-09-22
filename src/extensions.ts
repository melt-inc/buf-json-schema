import { DescriptorProto, FileDescriptorProto } from "@bufbuild/protobuf";
import descriptorToJSONSchema from "./message-descriptor";
import FileDescriptorProtoToJSONSchema from "./file-descriptor";

declare module "@bufbuild/protobuf" {
    interface DescriptorProto {
        toJSONSchema():void;
    }
    interface FileDescriptorProto {
        toJSONSchema():void;
    }
}

DescriptorProto.prototype.toJSONSchema = function() {
    return descriptorToJSONSchema(this);
}

FileDescriptorProto.prototype.toJSONSchema = function() {
    return FileDescriptorProtoToJSONSchema(this);
}

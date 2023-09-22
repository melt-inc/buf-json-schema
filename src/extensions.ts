import { DescriptorProto, FileDescriptorProto } from "@bufbuild/protobuf";
import DescriptorToJSONSchema from "./message-descriptor";
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
    return DescriptorToJSONSchema(this);
}

FileDescriptorProto.prototype.toJSONSchema = function() {
    return FileDescriptorProtoToJSONSchema(this);
}

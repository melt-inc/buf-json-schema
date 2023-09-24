import { DescriptorProto, DescriptorSet, FileDescriptorProto } from "@bufbuild/protobuf";
import descriptorToJSONSchema from "./message-descriptor";
import fileDescriptorToJSONSchema from "./file-descriptor";

declare module "@bufbuild/protobuf" {
    interface DescriptorProto {
        toJSONSchema(descriptors?: DescriptorSet):void;
    }
    interface FileDescriptorProto {
        toJSONSchema(descriptors?: DescriptorSet):void;
    }
}

DescriptorProto.prototype.toJSONSchema = function() {
    return descriptorToJSONSchema(this);
}

FileDescriptorProto.prototype.toJSONSchema = function() {
    return fileDescriptorToJSONSchema(this);
}

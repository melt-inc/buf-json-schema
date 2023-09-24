import { DescriptorProto, DescriptorSet, FileDescriptorProto } from "@bufbuild/protobuf";
import messageToJSONSchema from "./message-descriptor";
import fileDescriptorToJSONSchema from "./file-descriptor";

declare module "@bufbuild/protobuf" {
    interface DescriptorProto {
        toJSONSchema(descriptors?: DescriptorSet):void;
    }
    interface FileDescriptorProto {
        toJSONSchema(descriptors?: DescriptorSet):void;
    }
}

DescriptorProto.prototype.toJSONSchema = function(descriptors?: DescriptorSet) {
    return messageToJSONSchema(this, descriptors);
}

FileDescriptorProto.prototype.toJSONSchema = function(descriptors?: DescriptorSet) {
    return fileDescriptorToJSONSchema(this, descriptors);
}

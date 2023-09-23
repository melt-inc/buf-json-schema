import "../src/extensions"
import { describe, expect, test } from '@jest/globals';
import * as fs from 'node:fs';
import _ from 'lodash';
import { FileDescriptorSet } from "@bufbuild/protobuf";

describe("supported types", () => {
  // load descriptors from file
  const buffer = fs.readFileSync("test/example-descriptors.bin");

  let fileDescriptorSet = FileDescriptorSet.fromBinary(buffer);
  let fileDescriptor = _(fileDescriptorSet.file)
    .filter({name: "example.proto"})
    .first()!;

  // test("file", () => {
  //   expect(fileDescriptor.toJSONSchema()).toStrictEqual({
  //     "$schema": "http://json-schema.org/draft-07/schema",
  //     "definitions": {
  //       "WellKnown": {
  //         "title": "WellKnown",
  //         "type": "object",
  //       }
  //     },
  //     "oneOf": [{"ref": "#/definitions/WellKnown"}]
  //   });
  // });

  let messageDescriptor = _(fileDescriptor.messageType)
    .filter({name: "Simple"})
    .first()!;

  test("message", () => {
    expect(messageDescriptor.toJSONSchema()).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "Simple",
      "type": "object",
      "properties": {
        "name": {
          "title": "name",
          "type": "string"
        }
      }
    });
  });
});

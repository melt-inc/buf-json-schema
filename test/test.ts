import "../src/extensions"
import { describe, expect, test } from '@jest/globals';
import * as fs from 'node:fs';
import { FileDescriptorSet } from "@bufbuild/protobuf";

describe("supported types", () => {
  // load descriptors from file
  const buffer = fs.readFileSync("test/example-descriptors.bin");

  let fileDescriptorSet = FileDescriptorSet.fromBinary(buffer);

  let fileDescriptor = fileDescriptorSet.file[0];
  test("file", () => {
    expect(fileDescriptor.toJSONSchema()).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "$ref": "#/definitions/WellKnown",
      "definitions": {
        "WellKnown": {
          "properties": {
            "string_value": {
              "additionalProperties": true,
              "type": "string"
            },
            "map_of_integers": {
              "additionalProperties": {
                "additionalProperties": true,
                "type": "integer"
              },
              "type": "object"
            },
            "map_of_scalar_integers": {
              "additionalProperties": {
                "type": "integer"
              },
              "type": "object"
            },
            "list_of_integers": {
              "items": {
                "type": "integer",
                "title": "Int 32 Value",
                "description": "Wrapper message for `int32`. The JSON representation for `Int32Value` is JSON number."
              },
              "type": "array"
            },
            "duration": {
              "pattern": "^([0-9]+\\.?[0-9]*|\\.[0-9]+)s$",
              "type": "string",
              "description": "This is a duration:",
              "format": "regex"
            },
            "struct": {
              "additionalProperties": true,
              "type": "object"
            }
          },
          "additionalProperties": true,
          "type": "object",
          "title": "Well Known"
        }
      }
    });
  });

  // let messageDescriptor = fileDescriptorSet.file[0].messageType[0];
  // test("message", () => {
  //   expect(messageDescriptor.toJSONSchema()).toStrictEqual({
  //     "$schema": "http://json-schema.org/draft-07/schema",
  //     "title": "User",
  //     "type": "object"
  //   });
  // });
});

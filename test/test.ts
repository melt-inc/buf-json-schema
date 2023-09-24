import "../src/extensions"
import { describe, expect, test } from '@jest/globals';
import * as fs from 'node:fs';
import _ from 'lodash';
import { FileDescriptorSet, createDescriptorSet } from "@bufbuild/protobuf";

describe("supported types", () => {
  // load descriptors from file
  const buffer = fs.readFileSync("test/example-descriptors.bin");

  let descriptorSet = createDescriptorSet(FileDescriptorSet.fromBinary(buffer));
  let fileDescriptor = _(descriptorSet.files)
    .filter({name: "example"})
    .first()!;

  expect(fileDescriptor).toBeDefined();

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

  // let simpleMessageDescriptor = _(fileDescriptor.messageType)
  //   .filter({name: "Simple"})
  //   .first()!;

  // test("message", () => {
  //   expect(simpleMessageDescriptor.toJSONSchema()).toStrictEqual({
  //     "$schema": "http://json-schema.org/draft-07/schema",
  //     "title": "Simple",
  //     "type": "object",
  //     "properties": {
  //       "name": {
  //         "title": "name",
  //         "type": "string"
  //       }
  //     }
  //   });
  // });

  // let wellKnownDescriptor = _(fileDescriptor.messageType)
  //   .filter({name: "WellKnown"})
  //   .first()!;

  // test("message", () => {
  //   expect(wellKnownDescriptor.toJSONSchema()).toStrictEqual({
  //     "$schema": "http://json-schema.org/draft-07/schema",
  //     "title": "WellKnown",
  //     "type": "object",
  //     "properties": {
  //       "stringValue": {
  //         "title": "stringValue",
  //         "type": "string"
  //       },
  //       "listOfIntegers": {
  //         "items": {
  //           "type": "integer",
  //         },
  //         "title": "listOfIntegers",
  //         "type": "array",
  //       },
  //       "duration": {
  //         "title": "duration",
  //         "oneOf": [
  //           { "type": "string", "pattern": "^(-?)\\d+(\\.\\d+)?s$" },
  //           { "type": "object", "properties": { "seconds": { "type": "integer" }, "nanos": { "type": "integer" } } }
  //         ]
  //       },
  //       "struct": {
  //         "title": "struct",
  //         "type": "object"
  //       },
  //       "int32Value": {
  //         "title": "int32Value",
  //         "type": "integer"
  //       }
  //     }
  //   });
  // });

  let mapsDescriptor = _(fileDescriptor.messages)
    .filter({name: "Maps"})
    .first()!;

  test.skip("map", () => {
    expect(mapsDescriptor.proto.toJSONSchema()).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "Maps",
      "type": "object",
      "properties": {
        "exampleMap": {
          "title": "exampleMap",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    });
  });

  let nestedMessageDescriptor = _(fileDescriptor.messages)
    .filter({name: "NestedMessage"})
    .first()!;

  test("nested (no descriptorset)", () => {
    expect(nestedMessageDescriptor.proto.toJSONSchema()).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "NestedMessage",
      "type": "object",
      "definitions": {},
      "properties": {
        "exampleNestedMessage": {
          "title": "exampleNestedMessage",
          "$ref": "#/definitions/examples.Simple",
        }
      }
    });
  });

  test("nested (with descriptorset)", () => {
    expect(nestedMessageDescriptor.proto.toJSONSchema(descriptorSet)).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "NestedMessage",
      "type": "object",
      "definitions": {
        "examples.Simple": {
          "title": "Simple",
          "type": "object",
          "properties": {
            "name": {
              "title": "name",
              "type": "string"
            }
          }
        }
      },
      "properties": {
        "exampleNestedMessage": {
          "title": "exampleNestedMessage",
          "$ref": "#/definitions/examples.Simple",
        }
      }
    });
  });
});

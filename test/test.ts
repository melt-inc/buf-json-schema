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

  let simpleMessageDescriptor = _(fileDescriptor.messages)
    .filter({name: "Simple"})
    .first()!;

  test("message", () => {
    expect(simpleMessageDescriptor.proto.toJSONSchema()).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "Simple",
      "type": "object",
      "definitions": {},
      "properties": {
        "name": {
          "title": "name",
          "type": "string"
        }
      }
    });
  });

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

  describe("wellknown", () => {
    let wellKnownFile = _(descriptorSet.files)
      .filter({name: "wellknown"})
      .first()!;

    // TODO fix file descriptor
    test.skip("file", () => {
      expect(wellKnownFile.proto.toJSONSchema()).toStrictEqual({
        "$schema": "http://json-schema.org/draft-07/schema",
        "definitions": {
          "WellKnown": {
            "title": "WellKnown",
            "type": "object",
          }
        },
        "oneOf": [{"ref": "#/definitions/WellKnown"}]
      });
    });

    let wellKnownDescriptor = _(wellKnownFile.messages)
      .filter({name: "WellKnown"})
      .first()!;

    // TODO get mapOfIntegers working
    test.skip("message", () => {
      expect(wellKnownDescriptor.proto.toJSONSchema(descriptorSet)).toStrictEqual({
        "$schema": "http://json-schema.org/draft-07/schema",
        "title": "WellKnown",
        "type": "object",
        "definitions": {},
        "properties": {
          "stringValue": {
            "title": "stringValue",
            "type": "string"
          },
          "listOfIntegers": {
            "items": {
              "type": "integer"
            },
            "title": "listOfIntegers",
            "type": "array",
          },
          "duration": {
            "title": "duration",
            "type": "string",
            "pattern": "^(-?)\\d+(\\.\\d+)?s$"
          },
          "struct": {
            "title": "struct",
            "type": "object"
          },
          "int32Value": {
            "title": "int32Value",
            "type": "integer"
          }
        }
      });
    });
  });

  let messageWithEnumDescriptor = _(fileDescriptor.messages)
    .filter({name: "MessageWithEnum"})
    .first()!;

  test("message with enum", () => {
    expect(messageWithEnumDescriptor.proto.toJSONSchema(descriptorSet)).toStrictEqual({
      "$schema": "http://json-schema.org/draft-07/schema",
      "title": "MessageWithEnum",
      "type": "object",
      "definitions": {
        "examples.SimpleEnum_strings": {
          "title": "examples.SimpleEnum_strings",
          "type": "string",
          "enum": ["Unknown", "Yes", "No"]
        },
        "examples.SimpleEnum_values": {
          "title": "examples.SimpleEnum_values",
          "type": "integer",
          "enum": [0, 1, 2]
        },
      },
      "properties": {
        "exampleEnumField": {
          "title": "exampleEnumField",
          "oneOf": [
            {"$ref": "#/definitions/examples.SimpleEnum_strings"},
            {"$ref": "#/definitions/examples.SimpleEnum_values"}
          ]
        }
      }
    });
  });
});

import { expect, test } from "bun:test";
import { Type } from "typebox";
import * as Schema from "typebox/schema";

/** Guards the nullable-array tool argument shape fixed by Earendil's TypeBox 1.3.7 upgrade. */
test("TypeBox 1.3.7 compiles optional nullable array tool arguments", () => {
  const parameters = Type.Object({
    paths: Type.Optional(Type.Union([
      Type.Array(Type.String()),
      Type.Null(),
    ])),
  });
  const check = Schema.Compile(parameters);

  expect(check.Check({})).toBe(true);
  expect(check.Check({ paths: null })).toBe(true);
  expect(check.Check({ paths: ["notes", "skills"] })).toBe(true);
  expect(check.Check({ paths: ["notes", 42] })).toBe(false);
});

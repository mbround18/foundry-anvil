import { validateName } from "./name";
import colors from "colors";
const cases = [
  "apple bottom",
  "apple-bottom",
  "apple_bottom",
  "apple13413-booffewfwef",
];
for (const iterator of cases) {
  test(`Name Validation: ${iterator}`, () => {
    expect(validateName(iterator)).toEqual(iterator);
  });
}
const invalid = "APPLEFEWOFN#32131fvjevnejr";
test(`Name Validation: ${invalid}`, () =>
  expect(() => validateName("APPLEFEWOFN#32131fvjevnejr")).toThrow());

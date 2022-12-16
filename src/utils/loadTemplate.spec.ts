import { loadTemplate } from "./loadTemplate";

test("Test loading a template", () => {
  const template = loadTemplate("templates/module.json");
  expect(typeof template).toEqual("object");
  expect(typeof template.write).toEqual("function");
});

test("Test failing to load a template", () => {
  expect(() => loadTemplate("templates/for-sure-not-found-temmplate")).toThrow(
    "ENOENT: no such file or directory"
  );
});

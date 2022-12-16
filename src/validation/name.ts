import colors from "colors";
export function validateName(name: string): string {
  if (!/^[a-zA-Z0-9-_.\s]*$/.test(name)) {
    const badNaming = name
      .split("")
      .map((e) =>
        !/^[a-zA-Z0-9-_.\s]*$/.test(e) ? colors.red.bold.underline(e) : e
      )
      .join("");
    throw new Error(`The name provided, '${badNaming}',did not match the
following regex! /^[a-zA-Z0-9-_.]*$/`);
  }
  return name;
}

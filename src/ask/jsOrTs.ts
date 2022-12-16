import inquirer from "inquirer";

export const jsOrTsOptions = ["TypeScript", "JavaScript"];

export function jsOrTs(): Promise<{
  language: string;
}> {
  return inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "What language do you want to use?",
      choices: jsOrTsOptions,
      filter(val) {
        return val.toLowerCase();
      },
    },
  ]);
}

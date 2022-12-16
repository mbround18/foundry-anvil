import inquirer from "inquirer";

export async function whichPackageManager(): Promise<{
  packageManager: string;
}> {
  return inquirer.prompt([
    {
      type: "list",
      name: "packageManager",
      message: "What Package Manager do you want to use?",
      choices: ["yarn", "npm"],
      filter(val) {
        return val.toLowerCase();
      },
    },
  ]);
}

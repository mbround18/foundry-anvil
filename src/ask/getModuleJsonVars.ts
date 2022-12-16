import inquirer from "inquirer";

export function getModuleJsonVars(): Promise<{
  title: string;
  author: string;
  description: string;
}> {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What would you like to title this module?\n",
    },
    {
      type: "input",
      name: "description",
      message: "How would you describe this module?\n",
    },
    {
      type: "input",
      name: "author",
      message: "Whats your username/alias?\n",
    },
  ]);
}

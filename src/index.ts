import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getModuleJsonVars } from "./ask/getModuleJsonVars";
import { whichPackageManager } from "./ask/whichPackageManager";
import { initializePackageManager } from "./mutations/initializePackageManager";
import { loader } from "./templates";

// console.log(loadTemplate("templates/module.json.hbs")({ name: "banana" }));

yargs(hideBin(process.argv))
  .scriptName("foundry-anvil")
  .usage("$0 <cmd> [args]")
  .command(
    "new [name]",
    "Initialize a new FoundryVTT module!",
    (yargs) =>
      yargs
        .positional("name", {
          type: "string",
          describe: "The name to say hello to",
          required: true,
        })
        .demandOption("name", "You must provde a name for your project!")
        .positional("path", {
          type: "string",
          describe: "Path to initialize the project into.",
          default: cwd(),
          required: false,
        }),
    async function ({ name, path: outDir }: { name: string; path: string }) {
      if (existsSync(outDir)) {
        if ((readdirSync(outDir) ?? []).length > 0) {
          throw new Error(
            `Woah! This directory already has files in it! We cannot initialize here! ${outDir}`
          );
        }
      }

      console.time("Watcher");
      const { packageManager } = await whichPackageManager();

      initializePackageManager({ outDir, packageManager, name });

      // Write module.json
      console.timeLog("Watcher", "here i am");
      const moduleJson = loader("module.json");
      const moduleJsonVars = await getModuleJsonVars();
      moduleJson.write(outDir, {
        name,
        ...moduleJsonVars,
      });

      // Create Dirs
      const projectDirs = [
        "artwork",
        "templates",
        "scripts",
        "styles",
        "packs",
        "lang",
      ];

      for (const projectDir of projectDirs) {
        mkdirSync(join(outDir, projectDir));
        writeFileSync(join(outDir, projectDir, ".git-keep"), `# ${projectDir}`);
      }

      // Write Translation Dir
      writeFileSync(
        join(outDir, "lang", "en.json"),
        JSON.stringify({ example: "of translation" }, undefined, 2)
      );
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;

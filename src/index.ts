import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getModuleJsonVars } from "./ask/getModuleJsonVars";
import { jsOrTs } from "./ask/jsOrTs";
import { whichPackageManager } from "./ask/whichPackageManager";
import { exitHandler } from "./exit";
import { initializePackageManager } from "./mutations/initializePackageManager";
import { updatePackageJson } from "./mutations/updatePackageJson";
import { loader } from "./templates";

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
      } else {
        exitHandler(outDir);
      }

      const { packageManager } = await whichPackageManager();
      await initializePackageManager({ outDir, packageManager, name });
      const { language } = await jsOrTs();
      // Write module.json

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

      await updatePackageJson({
        outDir,
        packageManager,
        language,
      });

      // Write Translation Dir
      writeFileSync(
        join(outDir, "lang", "en.json"),
        JSON.stringify({ example: "of translation" }, undefined, 2)
      );

      loader(".gitignore").write(outDir, {});

      console.log(
        [
          "Congrats! You just generated a module initialization!",
          "This was generated via: https://foundryvtt.com/article/module-development/",
          "Now be sure to run the following commands and get started developing!",
          `cd ${outDir}`,
          `${packageManager} install`,
          "\n\n",
          "Be sure to visit the following link for module development information:",
          "https://foundryvtt.com/api/",
        ].join("\n")
      );
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;

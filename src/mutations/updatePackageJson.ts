import { spawnSync } from "child_process";
import { readFileSync, renameSync, writeFileSync } from "fs";
import { set } from "lodash";
import { jsOrTs, jsOrTsOptions } from "../ask/jsOrTs";
import { loader } from "../templates";
import { join } from "path";

export async function updatePackageJson({
  outDir,
  packageManager,
  language,
}: {
  outDir: string;
  packageManager: string;
  language: string;
}) {
  const packageJson = JSON.parse(
    readFileSync(join(outDir, "package.json"), "utf-8")
  );

  let extension = "js";
  if (language.toLowerCase() === "typescript") {
    extension = "ts";
    spawnSync(`${packageManager} add --dev typescript`);
  }
  set(
    packageJson,
    "scripts.build",
    `ncc ./scripts/init.${extension} --out ./dist`
  );
  loader("scripts/init.js").write(outDir, {});
  if (language.toLowerCase() === "typescript") {
    renameSync(
      join(outDir, "scripts/init.js"),
      join(outDir, "scripts/init.ts")
    );
  }
  writeFileSync(
    join(outDir, "package.json"),
    JSON.stringify(packageJson, undefined, 2)
  );

  const moduleJson = JSON.parse(
    readFileSync(join(outDir, "module.json"), "utf-8")
  );
  set(moduleJson, "scripts[0]", join(outDir, "dist/index.js"));
  writeFileSync(
    join(outDir, "module.json"),
    JSON.stringify(moduleJson, undefined, 2)
  );
}

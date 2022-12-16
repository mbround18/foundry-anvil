import { spawnSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "fs";
import { set } from "lodash";
import { join } from "path";
import { jsOrTs, jsOrTsOptions } from "../ask/jsOrTs";
import { loader } from "../templates";
export async function initializePackageManager({
  outDir,
  packageManager,
  name,
}: {
  name: string;
  packageManager: string;
  outDir: string;
}) {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  let command;
  if (packageManager === "yarn") {
    command = `${packageManager} init ${name} ${outDir} --yes --non-interative`;
  } else {
    command = "npm init --yes";
  }

  const { stderr: initError } = spawnSync(command, { shell: true });
  if (initError) {
    if (initError.toString().toLowerCase().includes("error")) {
      console.error(initError.toString());
      throw new Error(`${packageManager} ran into an error! Exiting now.`);
    }
  } else {
    spawnSync(`${packageManager} install --dev @vercel/ncc`);
  }
}

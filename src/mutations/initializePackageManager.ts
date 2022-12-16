import { spawnSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
export function initializePackageManager({
  outDir,
  packageManager,
  name,
}: {
  name: string;
  packageManager: string;
  outDir: string;
}) {
  console.timeLog("Watcher", "checking dir");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  console.timeLog("Watcher", "spawning yarn command");
  let command;
  if (packageManager === "yarn") {
    command = `${packageManager} init ${name} ${outDir} --yes --non-interative`;
  } else {
    command = "npm init --yes";
  }

  const { stderr: yarnInitError } = spawnSync(command, { shell: true });
  if (yarnInitError) {
    if (yarnInitError.toString().toLowerCase().includes("error")) {
      console.error(yarnInitError.toString());
      throw new Error("Yarn ran into an error! Exiting now.");
    }
  }
}

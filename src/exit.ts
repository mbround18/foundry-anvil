import { readdirSync, unlinkSync } from "fs";

function handler(outDir: string) {
  return () => {
    for (const file of readdirSync(outDir) ?? []) {
      unlinkSync(file);
    }
  };
}

export function exitHandler(outDir: string) {
  process.on("SIGINT", handler(outDir)); // CTRL+C
  process.on("SIGQUIT", handler(outDir)); // Keyboard quit
  process.on("SIGTERM", handler(outDir)); // `kill` command
}

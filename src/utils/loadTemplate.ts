import { readFileSync, writeFileSync } from "fs";
import { compile } from "handlebars";
import { join } from "path";
import { WORKING_DIR } from "../constants";

export function loadTemplate(path: string) {
  const buildFunction = compile(
    readFileSync(join(WORKING_DIR, path), "utf-8").toString()
  );

  return new (class Template {
    private path = path.replace("templates/", "").replace(".hbs", "");
    private build = buildFunction;
    public write(outDir: string, ...args: Parameters<typeof buildFunction>) {
      if (this.path.endsWith("json")) {
        writeFileSync(
          join(outDir, this.path),
          JSON.stringify(JSON.parse(this.build(...args)), undefined, 2)
        );
      } else {
        writeFileSync(join(outDir, this.path), this.build(...args));
      }
    }
  })();
}

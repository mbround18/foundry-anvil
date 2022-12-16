import { loadTemplate } from "./utils/loadTemplate";
const templates = {
  "module.json": "templates/module.json",
  "scripts/init.js": "templates/scripts/init.js",
  ".gitignore": "templates/.gitignore",
};
function loader(name: keyof typeof templates) {
  return loadTemplate(templates[name]);
}
export { templates, loader };

import { loadTemplate } from "./utils/loadTemplate";
const templates = {
  "module.json": "templates/module.json",
};
function loader(name: keyof typeof templates) {
  return loadTemplate(templates[name]);
}
export { templates, loader };

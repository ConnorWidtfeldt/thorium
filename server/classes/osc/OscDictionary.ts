import {OscMethod} from "./OscMethod";

const convertToId = (value: string) =>
  value
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^0-9a-z-_]/gi, "");

export class OscDictionary {
  class: "OscDictionary" = "OscDictionary";
  id: string;
  name: string;
  description: string;
  methods: OscMethod[];

  constructor(params: Partial<OscDictionary> = {}) {
    this.name = params.name || "Untitled Dictionary";
    this.description = params.description || "";

    // convert create id from name using kebab/snake case if not provided
    this.id = params.id || convertToId(this.name);

    this.methods = params.methods || [];
  }

  setName(name: string) {
    this.name = name;
    this.id = convertToId(name);
  }
  setDescription(description: string) {
    this.description = description;
  }
}

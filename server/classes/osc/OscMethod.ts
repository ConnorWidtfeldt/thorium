export class OscArg {
  class: "OscArg" = "OscArg";
}

export class OscMethod {
  class: "OscMethod" = "OscMethod";
  name: string;

  constructor(params: Partial<OscMethod> = {}) {
    this.name = params.name || "Untitled Method";
  }
}

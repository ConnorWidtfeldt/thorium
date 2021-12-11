import uuid from "uuid";

export class OscDevice {
  class: "OSCDevice" = "OSCDevice";
  id: string;
  name: string;
  dictionary: string;

  constructor(params: Partial<OscDevice> = {}) {
    this.id = params.id || uuid.v4();
    this.name = params.name || "OSC Device";
    this.dictionary = params.dictionary || "Coming Soon...";
  }

  setName(name: string) {
    this.name = name;
  }
  setDictionary(dictionary: string) {
    this.dictionary = dictionary;
  }
}

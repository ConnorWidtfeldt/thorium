import uuid from "uuid";

export class OscDevice {
  class: "OscDevice" = "OscDevice";
  id: string;
  name: string;
  dictionary: string;

  host: string;
  port: number;

  constructor(params: Partial<OscDevice> = {}) {
    this.name = params.name || "OSC Device";
    this.id = this.name
      .replace(" ", "-")
      .replace(/[^a-zA-Z0-9-_]/, "-")
      .toLowerCase();
    this.dictionary = params.dictionary;

    this.host = params.host || "127.0.0.1";
    this.port = params.port || 9001;
  }

  setName(name: string) {
    this.name = name;
  }
  setDictionary(dictionary: string) {
    this.dictionary = dictionary;
  }
  setHost(host: string) {
    this.host = host;
  }
  setPort(port: number) {
    this.port = port;
  }
}

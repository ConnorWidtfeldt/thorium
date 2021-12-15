import uuid from "uuid";

export class OscDevice {
  class: "OscDevice" = "OscDevice";
  id: string;
  name: string;
  dictionary: string;

  address: string;
  port: number;

  constructor(params: Partial<OscDevice> = {}) {
    this.id = params.id || uuid.v4();
    this.name = params.name || "OSC Device";
    this.dictionary = params.dictionary;

    this.address = params.address || "127.0.0.1";
    this.port = params.port || 1337;
  }

  setName(name: string) {
    this.name = name;
  }
  setDictionary(dictionary: string) {
    this.dictionary = dictionary;
  }
  setAddress(address: string) {
    this.address = address;
  }
  setPort(port: number) {
    this.port = port;
  }
}

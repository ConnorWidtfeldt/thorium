import App from "../app";
import * as OSC from "../helpers/osc";

import {Client, Message} from "node-osc";

interface MethodArgs {
  [key: string]: any;
}
interface OscInvokeMethodParams {
  deviceId: string;
  methodId: string;
  methodArgs: MethodArgs;
}

App.on(
  "oscInvokeMethod",
  ({deviceId, methodId, methodArgs}: OscInvokeMethodParams) => {
    const device = App.oscDevices.find(d => d.id === deviceId);
    if (device === undefined) return;

    const method = OSC.dictionaries
      .find(d => device.dictionary)
      .methods.find(m => m.id === methodId);
    if (method === undefined) return;

    const oscClient = new Client(device.host, device.port);
    // @ts-ignore
    oscClient.send(method.message(methodArgs), () => {
      console.log("Message Sent");
      oscClient.close();
    });
  },
);

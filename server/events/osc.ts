import App from "../app";

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
    console.log(deviceId, methodId, methodArgs);
  },
);

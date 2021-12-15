import {
  OscMethod
} from "~classes/osc"

export const generateMethodPath = <T>(method: OscMethod<T>) => {
  const pathArgs = {}
  for (const key of Object.keys(method.args)) {
    pathArgs[key] = `{${key}:${method.args[key].type}}`
  }
  return method.message(pathArgs as T);
}

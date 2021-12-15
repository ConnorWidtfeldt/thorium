import {gql} from "apollo-server-express";
import uuid from "uuid";
import {pubsub} from "../helpers/subscriptionManager";

import App from "../app";
import * as OSC from "../helpers/osc";
import {OscDevice} from "../classes/osc";

const schema = gql`
  type OscDevice {
    id: ID!
    name: String!
    dictionary: OscDictionary!
    address: String!
    port: Int!
  }
  input OscDeviceInput {
    id: ID
    name: String!
    dictionary: ID!
  }

  input OscDeviceConfig {
    name: String
    address: String
    port: Int
  }

  type OscDictionary {
    id: ID!
    name: String!
    description: String
    methods: [OscMethod!]!
  }
  input OscDictionaryInput {
    name: String!
    description: String
  }

  type OscMethod {
    id: String!
    name: String!
    path: String!
    description: String

    color: String
  }

  type OscMethodArgs {
    key: ID!
    name: String!
    type: String!
  }

  extend type Query {
    oscDevice(id: ID!): OscDevice

    oscDictionaries: [OscDictionary!]!
    oscDictionary(id: ID!): OscDictionary

    oscMethods(dictionary: ID): [OscMethod!]!
    oscMethodArgs(methodId: ID!): [OscMethodArgs!]!

    oscMethodValidation(id: ID!, args: JSON!): JSON!
  }
  extend type Mutation {
    oscDeviceCreate(device: OscDeviceInput!): ID
    oscDeviceRemove(id: ID!): Boolean
    oscDeviceDuplicate(name: String!, original: ID!): ID
    oscDeviceConfigure(id: ID!, config: OscDeviceConfig!): Boolean

    oscDictionaryCreate(dictionary: OscDictionaryInput!): ID

    """
    Macro: OSC: Invoke Method
    """
    oscInvokeMethod(deviceId: ID!, methodId: ID!): String
  }
  extend type Subscription {
    oscDevices: [OscDevice!]!
  }
`;

const getDevices = () =>
  App.oscDevices.map(({dictionary: dictionaryId, ...device}) => ({
    ...device,
    dictionary: getDictionary(dictionaryId),
  }));

interface Method extends OSC.OscMethod {
  path: string;
}
const getDictionaries = () =>
  OSC.dictionaries.map((dictionary: OSC.OscDictionary) => ({
    ...dictionary,
    methods: dictionary.methods.map(
      (method: OSC.OscMethod): Method => ({
        ...method,
        path: OSC.generateMethodPath(method),
      }),
    ),
  }));
const getDictionary = (id: string) =>
  getDictionaries().find(dictionary => dictionary.id === id);

const getMethods = () =>
  getDictionaries().flatMap(dictionary => dictionary.methods);
const getMethod = (methodId: string) =>
  getMethods().find(method => method.id === methodId);

const createMethodArgSchema = (method: OSC.OscMethod<any>) => {
  return Object.entries(method.args).map(([key, arg]) => ({
    key,
    name: arg.name,
    type: arg.type,
  }));
};

const resolver = {
  Query: {
    oscDevice(_, {id}) {
      return getDevices().find(device => device.id === id);
    },
    oscDictionaries() {
      return getDictionaries();
    },
    oscDictionary(_, {id}) {
      return getDictionary(id);
    },
    oscMethods(_, {dictionary}) {
      if (dictionary !== undefined) {
        const dict = getDictionary(dictionary);
        if (dict) {
          return dict.methods;
        } else {
          return [];
        }
      }
      return getMethods();
    },
    oscMethodArgs(_, {methodId}) {
      const method = getMethod(methodId);
      if (!method) return [];
      return createMethodArgSchema(method as OSC.OscMethod);
    },
    oscMethodValidation(_, {id, args}) {
      const method: OSC.OscMethod = getMethod(id);
      if (method === undefined) return [];
      return method.validate(args);
    },
  },
  Mutation: {
    oscDeviceCreate(_, {device}) {
      const oscDevice = new OscDevice(device);
      App.oscDevices.push(oscDevice);
      pubsub.publish("oscDevices", App.oscDevices);
      return oscDevice.id;
    },
    oscDeviceRemove(_, {id}) {
      const exists = App.oscDevices.find(device => device.id === id);
      if (!exists) return false;
      App.oscDevices = App.oscDevices.filter(device => device.id !== id);
      pubsub.publish("oscDevices", App.oscDevices);
      return true;
    },
    oscDeviceDuplicate(_, {name, original}) {
      const originalDevice = App.oscDevices.find(
        device => device.id === original,
      );
      if (!originalDevice) return null;

      const duplicateNameCheck =
        App.oscDevices.find(device => device.name === name) !== undefined;
      if (duplicateNameCheck) return null;

      const duplicateDevice = new OscDevice({
        ...originalDevice,
        name,
        id: null,
      });
      App.oscDevices.push(duplicateDevice);
      pubsub.publish("oscDevices", App.oscDevices);
      return duplicateDevice.id;
    },
    oscDeviceConfigure(_, {id, config}) {
      const device = App.oscDevices.find(d => d.id === id);
      if (!device) return false;

      if (config.name) device.setName(config.name);
      if (config.address) device.setAddress(config.address);
      if (config.port) device.setPort(config.port);
      return true;
    },
  },
  Subscription: {
    oscDevices: {
      resolve: () => getDevices(),
      subscribe: () => {
        const id = uuid.v4();
        process.nextTick(() => {
          pubsub.publish(id, App.oscDevices);
        });
        return pubsub.asyncIterator([id, "oscDevices"]);
      },
    },
  },
};

export default {schema, resolver};

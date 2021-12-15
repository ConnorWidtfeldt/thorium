import {gql} from "apollo-server-express";
import uuid from "uuid";
import {pubsub} from "../helpers/subscriptionManager";

import App from "../app";
import {OscDevice} from "../classes/osc";
import { generateMethodPath } from "../helpers/osc";

const schema = gql`
  type OscDevice {
    id: ID!
    name: String!
    dictionary: OscDictionary
  }
  input OscDeviceInput {
    name: String!
    dictionary: ID!
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

  input OscArgInput {
    key: String!
    value: String!
  }

  extend type Query {
    oscDevice(id: ID!): OscDevice

    oscDictionaries: [OscDictionary!]!
    oscDictionary(id: ID!): OscDictionary
  }
  extend type Mutation {
    oscDeviceCreate(device: OscDeviceInput!): ID
    oscDeviceRemove(id: ID!): Boolean
    oscDeviceDuplicate(name: String!, original: ID!): ID

    oscDictionaryCreate(dictionary: OscDictionaryInput!): ID

    """
    Macro: OSC: Invoke Method
    """
    oscInvokeMethod(
      deviceId: ID!
      methodId: ID!
      args: [OscArgInput!]
    ): String
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

const getDictionaries = () =>
  App.oscDictionaries.map(dictionary => ({
    ...dictionary,
    methods: dictionary.methods.map(method => ({
      ...method,
      path: generateMethodPath(method)
    }))
  }))

const getDictionary = (id: string) =>
  getDictionaries().find(dictionary => dictionary.id === id)
  

const resolver = {
  Query: {
    oscDevice(_, {id}) {
      return getDevices().find(device => device.id === id);
    },
    oscDictionaries() {
      return getDictionaries()
    },
    oscDictionary(_, {id}) {
      return getDictionary(id)
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

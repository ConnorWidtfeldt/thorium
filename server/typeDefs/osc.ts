import {gql} from "apollo-server-express";
import uuid from "uuid";
import {pubsub} from "../helpers/subscriptionManager";

import App from "../app";
import {OscDevice, OscDictionary} from "../classes";

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
    name: String!
  }

  extend type Query {
    oscDevices: [OscDevice!]!
    oscDevice(id: ID!): OscDevice

    oscDictionaries: [OscDictionary!]!
  }
  extend type Mutation {
    oscDeviceCreate(device: OscDeviceInput!): ID
    oscDeviceRemove(id: ID!): Boolean
    oscDeviceDuplicate(name: String!, original: ID!): ID

    oscDictionaryCreate(dictionary: OscDictionaryInput!): ID
  }
  extend type Subscription {
    oscDevices: [OscDevice!]!
    oscDictionaries: [OscDictionary!]!
  }
`;

const getDevices = () =>
  App.oscDevices.map(({dictionary: dictionaryId, ...device}) => ({
    ...device,
    dictionary: getDictionary(dictionaryId),
  }));

const getDictionary = (id: string) =>
  App.oscDictionaries.find(dictionary => dictionary.id === id);

const resolver = {
  Query: {
    oscDevices() {
      return getDevices();
    },
    oscDevice(_, {id}) {
      return App.oscDevices.find(device => device.id === id);
    },
    oscDictionaries() {
      return App.oscDictionaries;
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

    oscDictionaryCreate(_, {dictionary}) {
      const oscDictionary = new OscDictionary(dictionary);

      const duplicateIdCheck =
        App.oscDictionaries.find(
          dictionary => dictionary.id === oscDictionary.id,
        ) !== undefined;
      if (duplicateIdCheck) return null;

      App.oscDictionaries.push(oscDictionary);
      pubsub.publish("oscDictionaries", App.oscDictionaries);
      return oscDictionary.id;
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
    oscDictionaries: {
      resolve: rootValue => rootValue,
      subscribe: () => {
        const id = uuid.v4();
        process.nextTick(() => {
          pubsub.publish(id, App.oscDictionaries);
        });
        return pubsub.asyncIterator([id, "oscDictionaries"]);
      },
    },
  },
};

export default {schema, resolver};

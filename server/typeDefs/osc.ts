import {gql} from "apollo-server-express";
import uuid from "uuid";
import {pubsub} from "../helpers/subscriptionManager";

import App from "../app";
import {OscDevice} from "../classes";

const schema = gql`
  type OscDevice {
    id: ID
    name: String
    dictionary: String
  }
  input OscDeviceInput {
    name: String
    dictionary: String
  }
  extend type Query {
    oscDevices: [OscDevice!]!
  }
  extend type Mutation {
    oscDeviceCreate(device: OscDeviceInput!): String
    oscDeviceRemove(id: ID!): Boolean
  }
  extend type Subscription {
    oscDevices: [OscDevice!]!
  }
`;

const resolver = {
  Query: {
    oscDevices() {
      return App.oscDevices;
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
      const exists = App.oscDevices.find(f => f.id == id);
      if (!exists) return false;
      App.oscDevices = App.oscDevices.filter(f => f.id !== id);
      pubsub.publish("oscDevices", App.oscDevices);
      return true;
    },
  },
  Subscription: {
    oscDevices: {
      resolve(rootValue) {
        return rootValue;
      },
      subscribe: () => {
        const id = uuid.v4();
        process.nextTick(() => {
          let returnVal = App.oscDevices;

          pubsub.publish(id, returnVal);
        });
        return pubsub.asyncIterator([id, "oscDevices"]);
      },
    },
  },
};

export default {schema, resolver};

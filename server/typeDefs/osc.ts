import {gql} from "apollo-server-express";
import uuid from "uuid";
import {pubsub} from "../helpers/subscriptionManager";

import App from "../app";

const schema = gql`
  type OscDictionary {
    id: String
    name: String
    methods: [OscMethod]
  }
  type OscMethod {
    id: String
    name: String
    description: String
    args: [OscArg]
  }
  enum OscType {
    int
    float
    string
    blob
    time
    long
    double
    char
    color
    bool
    array
    nil
    infinity
  }
  type OscArg {
    key: String
    type: OscType

    name: String
    description: String
    default: String
  }
  type OscDevice {
    id: String
    name: String
    dictionary: String
  }
  extend type Query {
    oscDevices: [OscDevice!]!
  }
  extend type Subscription {
    oscDevices: [OscDevice!]!
    # oscDictionaries: [OscDictionary]
    # oscDictionary(id: String): OscDictionary
  }
`;

// const flattenDictionaries = () => (
//   App.oscDictionaries.map(dictionary => ({
//     ...dictionary,
//     methods: dictionary.methods.map(method => ({
//       ...method,
//       args: Object.entries(method.args).map(([key, value]) => ({
//         key,
//         ...value
//       }))
//     }))
//   }))
// )

// const resolver = {
//   Query: {
//     oscDictionaries() {
//       return flattenDictionaries()
//     },
//     oscDictionary(_, {id}) {
//       return flattenDictionaries().find(dictionary => (dictionary.id === id))
//     }
//   }
// }

const resolver = {
  Query: {
    oscDevices() {
      return App.oscDevices;
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

import App from "../app";
import {gql} from "apollo-server-express";


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
  extend type Query {
    oscDictionaries: [OscDictionary]
    oscDictionary(id: String): OscDictionary
  }
`

const flattenDictionaries = () => (
  App.oscDictionaries.map(dictionary => ({
    ...dictionary,
    methods: dictionary.methods.map(method => ({
      ...method,
      args: Object.entries(method.args).map(([key, value]) => ({
        key,
        ...value
      }))
    }))
  }))
)

const resolver = {
  Query: {
    oscDictionaries() {
      return flattenDictionaries()
    },
    oscDictionary(_, {id}) {
      return flattenDictionaries().find(dictionary => (dictionary.id === id))
    }
  }
}

export default {schema, resolver};

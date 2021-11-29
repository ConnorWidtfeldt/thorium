import {
  OscType as Type,
  OscMethod as Method,
} from "../common";

type CueID = number | RegExp;
type CueNumber = number;

interface ActionElapsed {
  cue: CueNumber
}
const actionElapsed: Method<ActionElapsed> = {
  id: "qlab.cue.actionElapsed",
  name: "Action Elapsed",
  description: "I really don't know",
  args: {
    cue: {
      name: "Cue Number",
      type: Type.String
    }
  },
  message(params) {
    return {
      address: `/cue/${params.cue}/actionElapsed`
    }
  }
}

export default [
  actionElapsed
]

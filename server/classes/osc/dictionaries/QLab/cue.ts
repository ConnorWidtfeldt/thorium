import {
  OscType as Type,
  OscMethod as Method,
  OscMethodGroup as MethodGroup,
  methodColor,
} from "../common";

type CueID = number | RegExp;
type CueNumber = number;

interface ActionElapsed {
  cue_number: CueNumber;
}
const actionElapsed: Method<ActionElapsed> = {
  id: "actionElapsed",
  name: "Action Elapsed",
  description: "I really don't know",
  color: methodColor.GREEN,
  args: {
    cue_number: {
      name: "Cue Number",
      type: Type.String,
    },
  },
  validate(params) {
    return {
      cue_number: true,
    };
  },
  message: ({cue_number}) => `/cue/${cue_number}/actionElapsed`,
};

interface Go {
  cue_number: CueNumber;
}
const go: Method<Go> = {
  id: "go",
  name: "Go",
  description: `<p>If the specified cue is not a cue list, tell QLab to jump to cue <code>cue_number</code> and then GO. <code>cue_number</code> must match a cue number in the given workspace.</p><p>If the specified cue is a cue list, then tell that cue list to <code>GO</code>. This <code>GO</code> respects the current playback position for that list, as well as double go protection for the workspace.</p>`,
  args: {
    cue_number: {
      name: "Cue Number",
      type: Type.String,
    },
  },
  validate(params) {
    return {
      cue_number: true,
    };
  },
  message: ({cue_number}) => `/cue/${cue_number}/go`,
};

const group: MethodGroup = {
  id: "cue",
  name: "Cue",
  color: methodColor.BLUE,
  methods: [actionElapsed, go],
};

export default group;

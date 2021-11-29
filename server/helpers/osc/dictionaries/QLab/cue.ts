import {
  OscType as Type,
  OscMethod as Method,
  OscValidationResult,
} from "../../common";

type CueID = number | RegExp;
type CueNumber = number;

const validateCueNumber = (value: any): OscValidationResult => {
  if (value === undefined || value.toString().length === 0) {
    return {
      message: "A cue number must be provided",
    };
  }
  return true;
};

interface Go {
  cue_number: CueNumber;
}
const go: Method<Go> = {
  id: "qlab.cue.go",
  name: "Go",
  description: `<p>If the specified cue is not a cue list, tell QLab to jump to cue <code>cue_number</code> and then GO. <code>cue_number</code> must match a cue number in the given workspace.</p><p>If the specified cue is a cue list, then tell that cue list to <code>GO</code>. This <code>GO</code> respects the current playback position for that list, as well as double go protection for the workspace.</p>`,
  args: {
    cue_number: {
      name: "Cue Number",
      type: Type.String,
    },
  },
  validate({cue_number}) {
    return {
      cue_number: validateCueNumber(cue_number),
    };
  },
  message: ({cue_number}) => `/cue/${cue_number}/go`,
};

interface Panic {
  cue_number: CueNumber;
}
const panic: Method<Panic> = {
  id: "qlab.cue.panic",
  name: "Panic",
  description: `Panic the specified cue. Panicked cues fade out and stop over the panic duration specified in the General section of Workspace Settings.`,
  args: {
    cue_number: {
      name: "Cue Number",
      type: Type.String,
    },
  },
  validate({cue_number}) {
    return {
      cue_number: validateCueNumber(cue_number),
    };
  },
  message: ({cue_number}) => `/cue/${cue_number}/panic`,
};

export default [go, panic];

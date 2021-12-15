export enum OscType {
  Int = "int",
  Float = "float",
  String = "string",
  Blob = "blob",
  Time = "time",
  Long = "long",
  Double = "double",
  Char = "char",
  Color = "color",
  Bool = "bool",
  Array = "array",
  Nil = "nil",
  Infinity = "infinity",
}
interface OscArg {
  type: OscType;
  value?: any;
}
interface OscArgMeta<T> {
  type: OscType;

  name?: string;
  description?: string;
  default?: T;
}

// message types
enum OscPacketType {
  Message,
  Bundle,
}
interface OscMessage {
  address: string;
  args?: OscArg[];
}
interface OscBundle {
  timetag: OscTime;
  content: OscPacket[];
}
interface OscPacket {
  type: OscPacketType;
  content: OscMessage | OscBundle;
}

// object types
interface OscColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}
interface OscTime {
  seconds: number;
  fractional: number;
}

export const arg = {
  int: (value: number) => ({type: OscType.Int, value}),
  float: (value: number) => ({type: OscType.Float, value}),
  string: (value: string) => ({type: OscType.String, value}),
  blob: (value: Blob) => ({type: OscType.Blob, value}),
  time: (value: OscTime) => ({type: OscType.Time, value}),
  long: (value: number) => ({type: OscType.Long, value}),
  double: (value: number) => ({type: OscType.Double, value}),
  char: (value: string) => ({type: OscType.Char, value}),
  color: (value: OscColor) => ({type: OscType.Color, value}),
  bool: (value: boolean) => ({type: OscType.Bool, value}),
  array: (value: OscArg[]) => ({type: OscType.Array, value}),
  nil: () => ({type: OscType.Nil}),
  infinity: () => ({type: OscType.Infinity}),
};

export const methodColor = {
  GREEN: "#49cc90",
  YELLOW: "#fca130",
  BLUE: "#61affe",
  RED: "#f93e3e",
};

export interface OscValidationError {
  message: string;
}
export type OscValidationResult = true | OscValidationError;
export type OscValidation<T> = {
  [key in keyof T]: OscValidationResult;
};

interface OscMethodCommon {
  name: string;
  color?: string;
}

export interface OscMethod<T = void> extends OscMethodCommon {
  id: string;
  description?: string;
  args: {
    [key in keyof T]: OscArgMeta<T>;
  };
  validate: (params: T) => OscValidation<T>;
  message: (params: T) => string;
}
export type OscGenericMethod = OscMethod<any>;

export interface OscDictionary {
  id: string;
  name: string;
  description?: string;
  methods: OscGenericMethod[];
}

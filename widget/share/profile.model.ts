// export const FunctionCode =  {
//   COIL = "COIL",
//   INPUT_REGISTER = "INPUT_REGISTER",
//   DISCRETE_INPUT = "DISCRETE_INPUT",
//   HOLDING_REGISTER = "HOLDING_REGISTER",
// }

export enum ProfileType {
  MODBUS = "MODBUS",
}

export interface FunctionCode {
  code: string;
  description: string;
}

export const FunctionCodeList: FunctionCode[] = [
  { code: "FC01", description: "Read coils" },
  { code: "FC02", description: "Read discrete inputs" },
  { code: "FC03", description: "Read multiple holding registers" },
  { code: "FC04", description: "Read input registers" },
  { code: "FC05", description: "Write single coil" },
  { code: "FC06", description: "Write single holding register" },
  { code: "FC15", description: "Write multiple coils" },
  { code: "FC16", description: "Write multiple holding registers" },
];

export enum DataType {
  UINT32 = "uint32",
  INT32 = "int32",
  UINT16 = "uint16",
  INT16 = "int16",
}

export interface Controller {
  ident: string;
  functionCode: string;
  name: string;
  start_address: number;
  count: number;
  unit: string;
  dataType: DataType;
}

export interface Controllers {
  [key: string]: Controller | undefined;
}

export interface Profile {
  id?: string;
  ident: string;
  name: string;
  type: ProfileType;
  version: string;
  //controllers: Controllers;
  controllers: Controller[];
  lastUpdate: number;
}

export const PROFILE_TYPE = "c8y_custom_fieldbusType";
export const PROFILE_FRAGMENT = "c8y_custom_fieldbusProfile";

export function uuidCustom(): string {
  let id = Math.random().toString(36).slice(-6);
  return id;
}

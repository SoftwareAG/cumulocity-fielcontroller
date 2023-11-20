export enum RegisterType {
  COIL = "COIL",
  INPUT_REGISTER = "INPUT_REGISTER",
  DISCRETE_INPUT = "DISCRETE_INPUT",
  HOLDING_REGISTER = "HOLDING_REGISTER",
}

export enum ProfileType {
  MODBUS = "MODBUS",
}

export enum DataType {
    UINT16 = "uint16",
  }

export interface Controller {
  ident: string;
  type: RegisterType;
  name: string;
  start_address: number;
  count: number;
  unit: string;
  dataType: DataType
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
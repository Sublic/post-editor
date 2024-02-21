import { ActionType } from "@bnb-chain/greenfield-cosmos-types/greenfield/permission/common";

export const AUTHORS_REQUIRED_ACTIONS: Array<ActionType> = [
  ActionType.ACTION_CREATE_OBJECT,
  ActionType.ACTION_DELETE_OBJECT,
  ActionType.ACTION_GET_OBJECT,
  ActionType.ACTION_LIST_OBJECT,
];

export const SUBSCRIBERS_REQUIRED_ACTIONS: Array<ActionType> = [
  ActionType.ACTION_GET_OBJECT,
  ActionType.ACTION_LIST_OBJECT,
];

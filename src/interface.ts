import { Fiber } from "./fiber"


export type TNode = Element | Text | DocumentFragment


export interface TEffect{
  fiber: Fiber,
  nextEffect: TEffect,
}


export interface Hook {
  memoizedState: any,
  baseState: any,
  baseUpdate: Update | null,
  queue: UpdateQueue | null,
  next: Hook | null,
}


export interface UpdateQueue{
  dispatch: any,
  last: Update,
  lastRenderedReducer?: any,
  lastRenderedState?: any,
}


export interface Update{
  next: Update,
  action: (pre: any) => any | any,
}
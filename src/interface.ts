import { Fiber } from "./fiber"


export type TNode = Element | Text | DocumentFragment


export interface TEffect{
  fiber: Fiber,
  nextEffect: TEffect,
}
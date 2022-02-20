import { Fiber } from "./fiber"


export type TNode = Element | Text | DocumentFragment


export namespace TReactElement {
  export type Type = "TEXT_ELEMENT" | string | FC
  export type FC = Function
  
  export interface Jsx{
    type: Type,
    props: Props,
  }
  
  export interface Props{
    [attribute: string]: any,
    children?: Jsx[],
  }
}


export namespace TReact{
  export interface Props{
    [attribute: string]: any,
    children?: TReactElement.Jsx[],
  }
}


export interface TEffect{
  fiber: Fiber,
  nextEffect: TEffect,
}
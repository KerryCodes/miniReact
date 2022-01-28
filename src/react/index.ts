import { TReactElement, TReactElementType, TTReactElementProps } from "../interface";


export function createElement(
  type: TReactElementType, 
  props: TTReactElementProps, 
  ...children: TReactElement[]
): TReactElement{
  if(typeof type === 'function'){
    return type({
      ...props, 
      children: {
        type: 'Fragment',
        props: { children },
      }
    })
  }else{
    return {
      type,
      props: {
        ...props,
        children: children.map(child => typeof child === "object" ? child : createTextElement(child)),
      },
    }
  }
}


function createTextElement(text: string | boolean): TReactElement{
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: (typeof text === 'boolean' || text === undefined) ? '' : text,
      children: Array(0),
    },
  }
}
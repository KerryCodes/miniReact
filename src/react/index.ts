import { TReactElement } from "../interface"


export function createElement(
  type: TReactElement.Type, 
  props: TReactElement.Props, 
  ...children: TReactElement.Jsx[]
): TReactElement.Jsx{
  if (typeof type === 'function') {
    const FunctionComponent= type
    return FunctionComponent({
      ...props, 
      child: {
        type: 'Fragment',
        props: { children },
      }
    })
  }else{
    return {
      type,
      props: {
        ...props,
        children: children.map(item => typeof item === "object" ? item : createTextElement(item)),
      },
    }
  }
}


function createTextElement(text: string | boolean): TReactElement.Jsx{
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: (typeof text === 'boolean' || text === undefined) ? '' : text,
      children: [],
    },
  }
}
import { TReactElement } from "../interface"


function createElement(
  type: TReactElement.Type, 
  props: TReactElement.Props, 
  ...children: TReactElement.Jsx[]
): TReactElement.Jsx{
  return {
    type,
    props: {
      ...props,
      children: children.flat().map(item => typeof item === "object" ? item : createTextElement(item)),
    },
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


export default { createElement }
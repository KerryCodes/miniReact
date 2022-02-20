import { TReactElement } from "../interface"


function createElement(type: JSX.Type, props: JSX.Props, ...children: JSX.Children): TReactElement.Jsx{
  return {
    type,
    props: {
      ...props,
      children: children.map(item => typeof item === "object" ? item : createTextElement(item)),
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


function Fragment(props: TReactElement.Props): TReactElement.Jsx[]{
  return props.children
}


export default { createElement, Fragment }
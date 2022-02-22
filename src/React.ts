function createElement(type: JSX.Type, props: JSX.Props, ...children: JSX.Children): ReactElement.Jsx{
  return {
    type,
    props: {
      ...props,
      children: children.map(item => typeof item === "object" ? item : createTextElement(item)),
    },
  }
}


function createTextElement(text: string | boolean): ReactElement.Jsx{
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: (typeof text === 'boolean' || text === undefined) ? '' : text,
      children: [],
    },
  }
}


function Fragment(props: ReactElement.Props): ReactElement.Jsx[]{
  return props.children
}


export default { createElement, Fragment }
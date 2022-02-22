import React from '../React'


export function FunctionComponentA(props: React.Props){
  const { children, ...attributes } = props

  const onClick = (e: Event) => {
    console.log('click:', e)
  }

  return <div {...attributes} onClick={onClick}>Hello {children}</div>
}
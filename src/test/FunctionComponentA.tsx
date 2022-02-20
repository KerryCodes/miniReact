import React from '../react'
import { TReact } from '../interface'


export function FunctionComponentA(props: TReact.Props){
  const { children, ...attributes } = props

  const onClick = (e: Event) => {
    console.log('click:', e)
  }

  return <div {...attributes} onClick={onClick}>Hello {children}</div>
}
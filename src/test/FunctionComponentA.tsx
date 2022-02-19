import React from '../react'
import { TReact } from '../interface'


export function FunctionComponentA(props: TReact.Props){
  const { children, ...rest } = props

  const onClick = (e: Event) => {
    console.log('click:', e)
  }

  return <div {...rest} onClick={onClick}>Hello {children}</div>
}
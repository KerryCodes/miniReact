import React from '../react'
import { TReact } from '../interface'


export function FunctionComponentA(props: TReact.Props){
  const { children, ...rest } = props

  return <div {...rest}>Hello {children}</div>
}
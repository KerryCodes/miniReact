import React from '../react'
import { TReact } from '../interface'


export function Aa(props: TReact.Props){
  const { children, ...rest } = props

  return <span {...rest}>A{children}</span>
}
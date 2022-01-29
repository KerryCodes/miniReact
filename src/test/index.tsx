import React from '../react'
import { TReact } from '../interface'


export function Aa(props: TReact.Props){
  const { id, child } = props

  return <span id={id}>A{child}</span>
}
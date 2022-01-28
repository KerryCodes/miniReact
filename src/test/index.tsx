import * as React from '../react'


export function Aa(props: any){
  const { id, children }= props

  return <div id={id}>A{children}</div>
}
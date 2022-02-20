import React from '../react'
import { TReact } from '../interface'
import { useState } from '../hooks'


export function TestHookCom(props: TReact.Props){
  const { children, ...attributes } = props
  const [count, setCount]= useState(10)

  const onClick = (e: Event) => {
    setCount(101)
    console.log('click:')
  }

  return <div {...attributes} onClick={onClick}>hook count: {count}</div>
}
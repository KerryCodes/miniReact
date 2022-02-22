import React from '../React'
import { useState } from '../hooks'


export function TestHookCom(props: React.Props){
  const { children, ...attributes } = props
  const [count, setCount]= useState(10)

  const onClick = (e: Event) => {
    setCount(Math.random())
    console.log('click:')
  }

  return <div {...attributes} onClick={onClick}>hook count: {count}</div>
}
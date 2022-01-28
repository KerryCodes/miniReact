import * as React from '../react'
import { TReact } from '../interface'
import * as schedule from '../schedule'


export function Aa(props: TReact.Props){
  const { id, child } = props

  
  schedule.scheduleDeferredCallback()
  
  const arr = []
  for (let i = 0; i < 100000000; i++){
    arr.push(i)
  }

  return <div id={id}>A{child}</div>
}
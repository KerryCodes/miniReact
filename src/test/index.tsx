import * as React from '../react'
import { TReact } from '../interface'
import * as schedule from '../schedule'


export function Aa(props: TReact.Props){
  const { id, child } = props

  schedule.startConcurrentWork(bigTask)

  return <div id={id}>A{child}</div>
}






let taskNumberRest= 1000
function bigTask(){
  const arr= []
  for (let i = 0; i < 100000; i++){
    arr.push(i)
  }
  const node= document.createTextNode(taskNumberRest.toString())
  document.getElementById('root').appendChild(node)
  taskNumberRest--

  return taskNumberRest < 1 ? null : bigTask
}
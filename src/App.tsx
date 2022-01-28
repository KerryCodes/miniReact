import * as React from './react'
import './index.less'
import { Aa } from "./test"


export default function App(){
  return (
    <div className="layout">
      <Aa id='aaa'>
        <strong>ac</strong>
      </Aa>
      {
        false && <div>8888</div>
      }
      <a>bar</a>
      <strong>kkkk</strong>
      <b />
    </div>
  )
}
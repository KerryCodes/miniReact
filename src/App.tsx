import './index.less'
import React from './react'
import { Aa } from "./test"


export default function App(){
  return (
    <div className="layout">
      <input />
      {
        Array(10).fill(0).map(item => (
          <Aa className='aaa'>
            <strong>hello world!</strong>
          </Aa>
        ))
      }
      <Aa id='aaa'>
        <strong>hello world!</strong>
      </Aa>
      {
        false && <div>8888</div>
      }
      <input />
      <a>bar</a>
      <strong>kkkk</strong>
      <b />
    </div>
  )
}
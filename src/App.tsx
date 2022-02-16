import './index.less'
import React from './react'
import { FunctionComponentA } from './test/FunctionComponentA'


export default function App(){
  return (
    <div className="layout">
      <FunctionComponentA className='aaa'>
        <strong>Hello world!</strong>
      </FunctionComponentA>
      {
        false && <div>check boolean</div>
      }
      {
        true && <div>check boolean</div>
      }
      <div>
        <span>check div</span>
      </div>
      <input />
      <a href="https://www.baidu.com" target='_blank'>百度</a>
      <br />
      <strong>check br</strong>
      <br />
      <strong>check br</strong>
      <br />
      <div>1000 FunctionComponentA:</div>
      {
        Array(1000).fill(0).map(item => (
          <FunctionComponentA className='aaa'>
            <strong>Hello world!</strong>
          </FunctionComponentA>
        ))
      }
    </div>
  )
}
import React from './App'

/** @jsx React.createElement */


const element = (
  <div id="foo">
    <a>bar</a>
    <strong>kkkk</strong>
    <b />
  </div>
)

React.render(element, document.getElementById("root"))
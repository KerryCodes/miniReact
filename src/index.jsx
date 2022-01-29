/** @jsx React.createElement */
import * as React from './react'
import * as ReactDOM from './react-dom'
import App from './App';
import * as schedule from './schedule'


schedule.openConcurrentMode()


const app = <App />
console.log('App:', app);
ReactDOM.render(app, document.getElementById("root"))
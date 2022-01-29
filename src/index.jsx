/** @jsx React.createElement */
import React from './react';
import ReactDOM from './react-dom';
import App from './App';


const app = <App />
console.log('App:', app);
// ReactDOM.render(app, document.getElementById("root"))
ReactDOM.concurrentRender(app, document.getElementById("root"))
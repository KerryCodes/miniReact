/** @jsx React.createElement */
import React from './react';
import ReactDOM from './react-dom';
import App from './App';


const app = <App />
console.log('App:', app);
// ReactDOM.render(app, document.getElementById("root"))
ReactDOM.createRoot(document.getElementById("root")).render(app) //开启Concurrent Mode
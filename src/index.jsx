/** @jsx React.createElement */
import React from './React';
import ReactDOM from './ReactDOM';
import App from './components/App';


const app = <App />
console.log('AppElement:', app);
// ReactDOM.render(app, document.getElementById("root"))
ReactDOM.createRoot(document.getElementById("root")).render(app) //开启Concurrent Mode
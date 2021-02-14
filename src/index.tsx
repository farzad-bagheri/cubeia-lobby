import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import './index.css';
import reducer from './redux/reducer';

const store = createStore(reducer);

//We use gsap, a not react lib, to implement animations.
//this gives type script the confidence that gsap is a valid property of window.
declare global {
  interface Window {
    gsap: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


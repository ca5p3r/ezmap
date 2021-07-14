import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { store } from './store';
import React from 'react';
import App from './app';
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
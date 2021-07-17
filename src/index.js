import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { store } from './store';
import React from 'react';
import App from './app';
import FontAwesomeLicense from './components/widgets/license';
ReactDOM.render(
  <Provider store={store}>
    <App />
    <FontAwesomeLicense />
  </Provider>,
  document.getElementById('root')
);
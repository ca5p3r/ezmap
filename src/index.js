import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { store } from './store';
import React from 'react';
import App from './app';
import FontAwesomeLicense from './components/ui/license';
import MyToast from './components/ui/toast';
ReactDOM.render(
  <Provider store={store}>
    <App />,
    <MyToast />,
    <FontAwesomeLicense />
  </Provider>,
  document.getElementById('root')
);
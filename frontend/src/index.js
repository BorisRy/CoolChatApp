import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './root-cmp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <ToastContainer
          limit={1}
          position="bottom-right"
          theme="dark"
          progressClassName="toastProgress"
          bodyClassName="toastBody" />
      </Router>
    </Provider>
  </React.StrictMode>
);



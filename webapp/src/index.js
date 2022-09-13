import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './store';
import { Provider } from 'react-redux';
import App from './components/App';
import Web3 from "web3/dist/web3.min.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
window.web3 = new Web3(window.ethereum);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
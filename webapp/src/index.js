import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import App from './components/App';
import Web3 from "web3/dist/web3.min.js";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import Faucet from "./components/Faucet";
import { AppBar, Button, Container, Icon, IconButton, SvgIcon, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { clearAccountsAction, requestAccountsAction } from './features/metamask';
import { fromBaseUnit, shortAddress } from './helpers';

const root = ReactDOM.createRoot(document.getElementById('root'));
window.web3 = new Web3(window.ethereum);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <NavigationBar />
                            <App />
                        </>} />
                    <Route path="/faucet" element={
                        <>
                            <NavigationBar />
                            <Faucet />
                        </>} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

function NavigationBar() {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { userAddress: address, balance } = useSelector(state => state.metamaskSlice);

    return (
        <AppBar component="nav" position='sticky'>
            <Toolbar>
                <Icon fontSize='large'>
                    <img src="/alpaca-ticker-blue.svg" height="100%" style={{background:"transparent"}} />
                </Icon>
                <Button
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontSize: 18 }}
                    onClick={() => nav("/")}
                >
                    <Typography>Alpaca Name Service</Typography>
                </Button>
                <Box sx={{ display: { sm: 'block' } }}>
                    <Button variant='outlined' key={"faucet"}
                        sx={{ color: '#fff' }}
                        onClick={() => nav("/faucet")}>
                        {"AlpacaUSD Faucet"}
                    </Button>
                    <Button variant='outlined' key={"connect"} sx={{ color: '#fff' }}
                        onClick={() => {
                            address ?
                                dispatch(clearAccountsAction) :
                                dispatch(requestAccountsAction)
                        }}>{address ? `${shortAddress(address, 5, 5)} (${fromBaseUnit(balance)} aUSD)` : "Connect Wallet"}</Button>
                </Box>
            </Toolbar>
        </AppBar>

    );
}
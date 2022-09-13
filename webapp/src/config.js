const config = {
    nameServiceAddress: process.env.REACT_APP_NAME_SERVICE_ADDRESS,
    alpacaUSDAddress: process.env.REACT_APP_ALPACAUSD_ADDRESS,
    faucetAddress: process.env.REACT_APP_FAUCET_ADDRESS,
};
console.log(process.env)
if (process.env.NODE_ENV === "production") { 
    config.chainId = '0x38';
    config.network = {
        chainName: 'BSC Mainnet',
        chainId: '0x38',
        nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
        rpcUrls: ['https://bsc-dataseed.binance.org/']
    }
} else {
    config.chainId = '0x61';
    config.network = {
        chainName: 'BSC Testnet',
        chainId: '0x61',
        nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545']
    }
}

export default config;
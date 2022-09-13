import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { claimTokens } from '../features/faucet';
import { fromBaseUnit } from '../helpers';
import { ConnectWalletButton } from './NameChecker';

function Faucet() {
    let { userAddress } = useSelector(state => state.metamaskSlice);
    let { balance } = useSelector(state => state.metamaskSlice);
    return (<>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 3">
            </Box>
            <Box gridColumn="span 6"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                margin="200px 0 0 0">
                {userAddress && <Typography>AlpacaUSD Balance: {fromBaseUnit(balance)}</Typography>}
                <ClaimButton />
            </Box>
            <Box gridColumn="span 3">
            </Box>
        </Box>
    </>);
}

function ClaimButton() {
    let { userAddress } = useSelector(state => state.metamaskSlice);
    let { claimed } = useSelector(state => state.faucetSlice);
    const dispatch = useDispatch();

    if (!userAddress)
        return (<ConnectWalletButton />);

    if (claimed)
        return (<Typography sx={{ color: 'red' }}>Already Claimed</Typography>);

    return (<Button onClick={() => {
        dispatch(claimTokens)
    }}>Claim 50 Tokens</Button>);
}

export default Faucet;

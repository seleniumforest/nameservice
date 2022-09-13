import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearAccountsAction, requestAccountsAction } from '../features/metamask';
import { fromBaseUnit } from '../helpers';

function MetamaskConnector() {
    const dispatch = useDispatch();
    const {
        userAddress: address,
        balance,
        userNames
    } = useSelector(state => state.metamaskSlice)

    return (
        <>
            <Button onClick={() => {
                address ?
                    dispatch(clearAccountsAction) :
                    dispatch(requestAccountsAction)
            }}>{address ? address : "Connect Wallet"}</Button>
            
            {address &&
                <div>{"alpacaUSD balance: " + fromBaseUnit(balance)}</div>}

            <div>Existing names:</div>
            <ul>
                {userNames.map((name) => <li key={name}>
                    {name}
                </li>)}
            </ul>
        </>
    );
}

export default MetamaskConnector;

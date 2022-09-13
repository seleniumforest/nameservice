import { Box, Input, List, ListItemText, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { requestAccountsAction } from '../features/metamask';
import { approveToken, checkNameAction, registerName, setNameInputAction } from '../features/nameChecker';
import { fromBaseUnit } from '../helpers';

function NameChecker() {
    const dispatch = useDispatch();
    const {
        resolvedAddress,
        resolvedName,
        nameInput
    } = useSelector(state => state.nameCheckerSlice);
    const { userNames, userAddress } = useSelector(state => state.metamaskSlice);

    return (
        <>
            <div>
                <Input placeholder='.alpaca'
                    value={nameInput}
                    onChange={(e) => {
                        dispatch(setNameInputAction(e?.target?.value))
                    }} />
            </div>

            <Button onClick={() => {
                if (!nameInput.endsWith(".alpaca"))
                    dispatch(setNameInputAction(nameInput + ".alpaca"));

                dispatch(checkNameAction);
            }}>Check name</Button>
            <br />
            <Typography alignContent="center">
                {getResultString(resolvedName, resolvedAddress, nameInput)}
            </Typography>
            <ButtonFacade />
            {userAddress && userNames.length > 0 &&
                <Box
                    justifyContent="center"
                    alignItems="center"
                    sx={{ position: 'fixed', bottom: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Your Names:</Typography>
                    <List>
                        {userNames.map(name => (
                            <ListItemText key={name}>{name}</ListItemText>
                        ))}
                    </List>
                </Box>
            }

        </>
    );
}

const ButtonFacade = () => {
    const { approved, userAddress, balance } = useSelector(state => state.metamaskSlice);
    const isApproved = parseFloat(fromBaseUnit(approved)) >= 20;
    const {
        resolvedAddress
    } = useSelector(state => state.nameCheckerSlice);
    const dispatch = useDispatch();
    if (!userAddress)
        return (<ConnectWalletButton />);

    if (parseFloat(fromBaseUnit(balance)) < 20)
        return "Not enough alpacaUSD. Mint price is 20 aUSD";

    if (resolvedAddress === "0x0000000000000000000000000000000000000000") {
        if (isApproved)
            return (
                <Button onClick={() => {
                    dispatch(registerName)
                }}>{"Register Name"}</Button>);

        return (
            <>
                <Typography>Approve aUSD to buy domain</Typography>
                <Button onClick={() => {
                    dispatch(approveToken)
                }}>{"Approve alpacaUSD"}</Button>
            </>
        )
    }

    return null;
}

export const ConnectWalletButton = () => {
    const dispatch = useDispatch();
    return (
        <Button onClick={() => {
            dispatch(requestAccountsAction)
        }}>{"Connect Wallet"}</Button>
    )
}

const getResultString = (resolvedName, resolvedAddress) => {
    if (!resolvedName || !resolvedAddress)
        return "";

    if (resolvedAddress === "0x0000000000000000000000000000000000000000")
        return (<Typography component={'span'} color="green">
            {`Name ${resolvedName}.alpaca is avaliable to mint for 20 alpacaUSD`}
        </Typography>)

    return (<Typography component={'span'} color="red">
        {`Name ${resolvedName}.alpaca resolved to ${resolvedAddress}`}
    </Typography>);
}

export default NameChecker;

import { Input } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { approveToken, checkNameAction, registerName, setNameInputAction } from '../features/nameChecker';
import { fromBaseUnit } from '../helpers';

function NameChecker() {
    const dispatch = useDispatch();
    const {
        resolvedAddress,
        resolvedName,
        nameInput
    } = useSelector(state => state.nameCheckerSlice);
    const { approved } = useSelector(state => state.metamaskSlice);
    const isApproved = parseFloat(fromBaseUnit(approved)) >= 20;
    
    return (
        <>
            <Input placeholder='.alpaca'
                value={nameInput}
                onChange={(e) => {
                    dispatch(setNameInputAction(e?.target?.value))
                }} />
            <Button onClick={() => {
                if (!nameInput.endsWith(".alpaca"))
                    dispatch(setNameInputAction(nameInput + ".alpaca"));

                dispatch(checkNameAction);
            }}>Check name</Button>
            <br />
            <div>{getResultString(resolvedName, resolvedAddress)}</div>
            {resolvedAddress === "0x0000000000000000000000000000000000000000" &&
                <Button onClick={() => {
                    isApproved ?
                        dispatch(registerName) :
                        dispatch(approveToken)
                }}>
                    {isApproved ? "Register Name" : "Approve alpacaUSD"}
                </Button>}
        </>
    );
}

const getResultString = (resolvedName, resolvedAddress) => {
    if (!resolvedName || !resolvedAddress)
        return "";

    if (resolvedAddress === "0x0000000000000000000000000000000000000000")
        return `Name ${resolvedName} is free`;

    return `Name ${resolvedName} resolved to ${resolvedAddress}`
}

export default NameChecker;

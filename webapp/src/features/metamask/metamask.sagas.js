import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { REQUEST_ACCOUNTS_SAGA } from "./metamask.constants";
import { setAddress, requestAddressFailed, setTokenBalance, setUserNames, setApproved } from "./metamask.slice";
import erc20abi from "../../resources/Erc20Abi.json";
import nameSperviceAbi from "../../resources/NameServiceAbi.json";
import structuredClone from "@ungap/structured-clone";
import config from "../../config";
import { APPROVE_TOKEN_SAGA } from "../nameChecker/namechecker.constants";

export function* requestAccountsSaga() {
    try {
        const [address] = yield call(
            window.ethereum.request,
            { method: 'eth_requestAccounts' }
        );

        yield put(setAddress({ userAddress: address }));
        let tokenContract = new window.web3.eth.Contract(
            structuredClone(erc20abi),
            config.alpacaUSDAddress);
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        let balance = yield call(tokenContract.methods.balanceOf(userAddress).call);
        yield put(setTokenBalance({ balance: balance }));
        let approved = yield call(tokenContract.methods.allowance(userAddress, config.nameServiceAddress).call);
        yield put(setApproved({ approved }));

        yield call(loadExistingNamesSaga);
    } catch (e) {
        yield put(requestAddressFailed({ message: e?.message }));
    }
}

export function* loadExistingNamesSaga() {
    try {
        let nameServiceContract = new window.web3.eth.Contract(
            structuredClone(nameSperviceAbi),
            config.nameServiceAddress);
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        let existingNames = yield call(nameServiceContract.methods.getNamesOnAddress(userAddress).call);
        yield put(setUserNames({ userNames: existingNames }))
    } catch (e) { }
}

function* watchRequestAccountsSaga() {
    yield takeEvery(REQUEST_ACCOUNTS_SAGA, requestAccountsSaga)
}

export function* approveTokenSaga() {
    try {
        let tokenContract = new window.web3.eth.Contract(
            structuredClone(erc20abi),
            config.alpacaUSDAddress);
        let spender = config.nameServiceAddress;
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        yield call(
            tokenContract.methods.approve(spender, "50000000000000000000").send,
            { from: userAddress });
        yield put(setApproved({ approved: "50000000000000000000" }))
    } catch (e) { }
}

function* watchApproveTokenSaga() {
    yield takeEvery(APPROVE_TOKEN_SAGA, approveTokenSaga)
}

const metamaskSagas = [
    fork(watchRequestAccountsSaga),
    fork(watchApproveTokenSaga)
]

export default metamaskSagas;
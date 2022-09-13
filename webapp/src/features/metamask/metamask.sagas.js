import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { REQUEST_ACCOUNTS_SAGA } from "./metamask.constants";
import { setAddress, requestAddressFailed, setTokenBalance, setUserNames, setApproved } from "./metamask.slice";
import erc20abi from "../../resources/Erc20Abi.json";
import nameSperviceAbi from "../../resources/NameServiceAbi.json";
import structuredClone from "@ungap/structured-clone";
import config from "../../config";
import { APPROVE_TOKEN_SAGA } from "../nameChecker/namechecker.constants";
import { isClaimedSaga } from "../faucet/faucet.sagas";

export function* changeNetworkSaga() {
    if (window.ethereum.networkVersion !== '97') {
        try {
            yield call(window.ethereum.request,
                {
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: config.chainId }]
                });
        } catch (err) {
            if (err.code === 4902) {
                yield call(window.ethereum.request,
                    {
                        method: 'wallet_addEthereumChain',
                        params: [config.network]
                    });
            }
        }
    }
}

export function* requestAccountsSaga() {
    try {
        yield call(changeNetworkSaga);
        const [address] = yield call(
            window.ethereum.request,
            { method: 'eth_requestAccounts' }
        );
        yield put(setAddress({ userAddress: address }));

        yield call(loadTokenBalanceSaga);
        yield call(loadTokenApprovalSaga);
        yield call(loadExistingNamesSaga);
        yield call(isClaimedSaga)
    } catch (e) {
        yield put(requestAddressFailed({ message: e?.message }));
    }
}

export function* loadTokenApprovalSaga() {
    try {
        let tokenContract = new window.web3.eth.Contract(
            structuredClone(erc20abi),
            config.alpacaUSDAddress);
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        let approved = yield call(tokenContract.methods.allowance(userAddress, config.nameServiceAddress).call);
        yield put(setApproved({ approved }));
    } catch (e) { }
}


export function* loadTokenBalanceSaga() {
    try {
        let tokenContract = new window.web3.eth.Contract(
            structuredClone(erc20abi),
            config.alpacaUSDAddress);
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        let balance = yield call(tokenContract.methods.balanceOf(userAddress).call);
        yield put(setTokenBalance({ balance: balance }));
    } catch (e) { }
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
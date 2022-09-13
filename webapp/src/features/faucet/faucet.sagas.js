import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import abi from "../../resources/FaucetAbi.json";
import structuredClone from '@ungap/structured-clone';
import config from "../../config";
import { CLAIM_TOKENS_SAGA } from "./faucet.constants";
import { setClaimed } from "./faucet.slice";
import { loadTokenBalanceSaga } from "../metamask/metamask.sagas";

export function* claimTokensSaga() {
    try {
        let contract = new window.web3.eth.Contract(structuredClone(abi), config.faucetAddress);
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        yield call(contract.methods.claim().send, { from: userAddress });
        yield put(setClaimed({ claimed: true }));
        yield call(loadTokenBalanceSaga);
    } catch (e) {
      console.log(e?.message)
    }
}

function* watchClaimTokensSaga() {
    yield takeEvery(CLAIM_TOKENS_SAGA, claimTokensSaga)
}

export function* isClaimedSaga() {
    try {
        let contract = new window.web3.eth.Contract(structuredClone(abi), config.faucetAddress);
        let userAddress = yield select((state) => state.metamaskSlice.userAddress);
        let claimed = yield call(contract.methods.isClaimed().call, { from: userAddress });
        yield put(setClaimed({ claimed }));
    } catch (e) {
      console.log(e?.message)
    }
}

const faucetSagas = [
    fork(watchClaimTokensSaga)
]

export default faucetSagas;
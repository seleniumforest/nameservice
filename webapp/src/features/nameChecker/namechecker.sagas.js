import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { CHECK_NAME_SAGA, REGISTER_NAME_SAGA } from "./namechecker.constants";
import abi from "../../resources/NameServiceAbi.json";
import structuredClone from '@ungap/structured-clone';
import config from "../../config";
import { setResolvedAddress } from "./namechecker.slice";
import { loadExistingNamesSaga, loadTokenApprovalSaga, loadTokenBalanceSaga } from "../metamask/metamask.sagas";

export function* checkNameSaga() {
    try {
        let contract = new window.web3.eth.Contract(structuredClone(abi), config.nameServiceAddress);
        let domainInput = yield select((state) => state.nameCheckerSlice.nameInput);
        let domain = domainInput.endsWith(".alpaca") ? 
            domainInput.substring(0, domainInput.length - 7) : 
            domainInput;

        let result = yield call(contract.methods.resolveName(domainInput).call);
        yield put(setResolvedAddress({ resolvedAddress: result, resolvedName: domain }))
    } catch (e) {
      console.log(e?.message)
    }
}

function* watchCheckNameSaga() {
    yield takeEvery(CHECK_NAME_SAGA, checkNameSaga)
}

export function* registerNameSaga() {
    try {
        let contract = new window.web3.eth.Contract(structuredClone(abi), config.nameServiceAddress);
        let name = yield select((state) => state.nameCheckerSlice.resolvedName);
        let from = yield select((state) => state.metamaskSlice.userAddress);
        yield call(contract.methods.mintName(name).send, { from });
        yield call(loadTokenBalanceSaga);
        yield call(loadTokenApprovalSaga);
        yield call(loadExistingNamesSaga);
    } catch (e) {
      console.log(e?.message)   
    }
}

function* watchRegisterNameSaga() {
    yield takeEvery(REGISTER_NAME_SAGA, registerNameSaga)
}

const nameCheckerSagas = [
    fork(watchCheckNameSaga),
    fork(watchRegisterNameSaga)
]

export default nameCheckerSagas;
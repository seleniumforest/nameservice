import { all } from "redux-saga/effects";
import { faucetSagas } from "./features/faucet";
import { metamaskSagas } from "./features/metamask";
import nameCheckerSagas from "./features/nameChecker/namechecker.sagas";

export default function* rootSaga() {
    yield all([
        ...metamaskSagas,
        ...nameCheckerSagas,
        ...faucetSagas
    ])
}

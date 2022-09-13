import { all } from "redux-saga/effects";
import { metamaskSagas } from "./features/metamask";
import nameCheckerSagas from "./features/nameChecker/namechecker.sagas";

export default function* rootSaga() {
    yield all([
        ...metamaskSagas,
        ...nameCheckerSagas
    ])
}

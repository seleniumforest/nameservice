import { CHECK_NAME_SAGA, REGISTER_NAME_SAGA, APPROVE_TOKEN_SAGA } from "./namechecker.constants";
import { setInput } from "./namechecker.slice";

export const checkNameAction = {
    type: CHECK_NAME_SAGA
}

export const registerName = {
    type: REGISTER_NAME_SAGA
}

export const approveToken = {
    type: APPROVE_TOKEN_SAGA
}

export const setNameInputAction = (name) => 
    setInput({ nameInput: name });
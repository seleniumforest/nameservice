import { REQUEST_ACCOUNTS_SAGA } from "./metamask.constants"
import { setAddress } from "./metamask.slice"

export const requestAccountsAction = {
    type: REQUEST_ACCOUNTS_SAGA
}

export const clearAccountsAction = 
    setAddress({ userAddress: "" })
import big from 'big.js';

export const fromBaseUnit = (amount, decimals = 18) => {
    let demicrofied = big(amount.toString().replace(",", "."))
        .div(Math.pow(10, decimals))
        .toFixed();

    return typeof amount === "string" ? demicrofied.toString() : demicrofied;
}

export const shortAddress = (addr, start = 5, end = 2) =>
    `${addr.slice(0, start)}...${addr.slice(addr.length - end, addr.length)}`;
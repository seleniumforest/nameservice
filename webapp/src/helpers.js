import big from 'big.js';

export const fromBaseUnit = (amount, decimals = 18) => {
    let demicrofied = big(amount.toString().replace(",", "."))
        .div(Math.pow(10, decimals))
        .toFixed();

    return typeof amount === "string" ? demicrofied.toString() : demicrofied;
}
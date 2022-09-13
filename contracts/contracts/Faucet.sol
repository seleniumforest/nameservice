// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Faucet {
    address token;
    mapping(address => bool) isClaimed;

    constructor(address tokenAddress) {
        token = tokenAddress;
    }

    function claim() public {
        require(isClaimed[msg.sender] == false, "Already claimed");

        IERC20(token).transfer(
            msg.sender,
            10 ** 18 * 50
        );

        isClaimed[msg.sender] = true;
    }
}

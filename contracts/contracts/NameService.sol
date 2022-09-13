// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NameService is Ownable, ERC721("Alpaca Name Service", "APNS") {
    mapping(string => uint256) idByName;
    mapping(uint256 => string) nameById;
    mapping(address => uint256[]) ownings;

    uint256 tokenIdCounter = 1;
    address paymentToken;

    constructor(address token) {
        paymentToken = token;
    }

    function mintName(string calldata name) public {
        string memory fullName = string.concat(name, ".alpaca");
        require(idByName[fullName] == 0, "Already exists");
        IERC20(paymentToken).transferFrom(msg.sender, address(this), 10**18);

        _safeMint(msg.sender, tokenIdCounter);
        idByName[fullName] = tokenIdCounter;
        nameById[tokenIdCounter] = fullName;
        ownings[msg.sender].push(tokenIdCounter);
        tokenIdCounter = tokenIdCounter + 1;
    }

    function resolveName(string calldata name) public view returns (address) {
        uint256 id = idByName[name];
        if (id == 0) return address(0);

        return ownerOf(id);
    }

    function getNamesOnAddress(address owner)
        public
        view
        returns (string[] memory)
    {
        uint256[] memory owns = ownings[owner];
        string[] memory names = new string[](owns.length);
        for (uint256 i = 0; i < owns.length; i++){
            names[i] = nameById[owns[i]];
        }
        return names;
    }

    function changeOwning(
        address from,
        address to,
        uint256 tokenId
    ) internal {
        ownings[to].push(tokenId);

        uint256[] storage own = ownings[from];
        for (uint256 i = 0; i < own.length; i++) {
            if (own[i] == tokenId && i < own.length) {
                own[i] = own[own.length - 1];
                own.pop();
                break;
            }
        }
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        changeOwning(from, to, tokenId);
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        changeOwning(from, to, tokenId);
        super.safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        changeOwning(from, to, tokenId);
        super.safeTransferFrom(from, to, tokenId, data);
    }
}

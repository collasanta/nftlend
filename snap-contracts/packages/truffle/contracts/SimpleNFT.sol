// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNFT is ERC721 {
    constructor() ERC721("Mock NFT", "MNFT") {}
    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }
}
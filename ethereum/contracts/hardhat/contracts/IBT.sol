// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IBT
 * @dev ERC20 Token cu mint și burn restricționate doar la owner.
 */
contract IBT is ERC20, Ownable(msg.sender) {
    constructor() ERC20("IBT", "IBT") {
        // Optional: poți face un mint inițial către owner, dacă vrei
        // _mint(msg.sender, 1000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

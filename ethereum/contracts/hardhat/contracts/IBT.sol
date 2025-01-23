// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract IBT is ERC20 {
    address public owner;
    constructor() ERC20("InterBlockchain Token", "IBT") {
        owner = msg.sender;
    }
    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
    }
    function burn(uint256 amount) external {
        require(msg.sender == owner, "Only owner can burn");
        _burn(msg.sender, amount);
    }
}
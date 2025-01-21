// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IBT
 * @dev ERC20 Token cu mint si burn restricționate la doar owner-ul contractului.
 */
contract IBT is ERC20, Ownable {
    // Constructorul setează numele și simbolul token-ului.
    constructor() ERC20("IBT", "IBT") Ownable(msg.sender) {
        // Optional: poti face un mint initial catre owner, daca vrei
        // _mint(msg.sender, 1000 * 10**decimals());
    }

    /**
     * @notice Mint de IBT - doar proprietarul poate apela
     * @param to Adresa care primeste token-urile
     * @param amount Cantitatea de token-URI de mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Burn de IBT - doar proprietarul poate apela
     * @param from Adresa de unde se ard token-urile
     * @param amount Cantitatea de token-URI de ars
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

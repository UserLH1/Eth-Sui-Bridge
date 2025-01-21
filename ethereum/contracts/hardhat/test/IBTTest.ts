import { expect } from "chai";
import { ethers } from "hardhat";
// SignerWithAddress pentru Ethers v6:
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// Tipuri generate de TypeChain (pune calea corectă, ex. "../typechain-types/contracts/IBT")
import type { IBT } from "../typechain-types";
import type { ContractFactory } from "ethers";

describe("IBT Contract", function () {
  let ibtFactory: ContractFactory;
  let ibt: IBT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    // Obține conturile de test
    [owner, addr1] = await ethers.getSigners() as unknown as SignerWithAddress[];

    // Ia un ContractFactory pentru IBT
    ibtFactory = await ethers.getContractFactory("IBT");

    // Deploy contract
    ibt = (await ibtFactory.deploy()) as IBT;
    // În Ethers 6, nu mai există .deployed(), ci waitForDeployment():
    await ibt.waitForDeployment();
  });

  it("Owner can mint tokens", async function () {
    // Owner face mint 100
    await ibt.mint(await owner.getAddress(), 100);
    // Citim balanța, Ethers 6 returnează un bigint
    const balance = await ibt.balanceOf(await owner.getAddress());
    // Comparam cu 100n
    expect(balance).to.equal(100n);
  });

  it("Non-owner cannot mint tokens", async function () {
    await expect(
      ibt.connect(addr1).mint(await addr1.getAddress(), 100)
    )
      // specificăm contractul și numele custom errorului
      .to.be.revertedWithCustomError(ibt, "OwnableUnauthorizedAccount")
      // eventual, putem verifica și argumentul care apare în custom error
      .withArgs(await addr1.getAddress());
  });

  it("Owner can burn tokens", async function () {
    await ibt.mint(await owner.getAddress(), 200);
    await ibt.burn(await owner.getAddress(), 100);
    const balance = await ibt.balanceOf(await owner.getAddress());
    expect(balance).to.equal(100n);
  });
});

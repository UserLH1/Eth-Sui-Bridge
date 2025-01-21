import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IBT } from "../typechain-types"; 
import { ContractFactory } from "ethers";

describe("IBT Contract", function () {
  let ibtFactory: ContractFactory;
  let ibt: IBT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    ibtFactory = await ethers.getContractFactory("IBT");
    ibt = (await ibtFactory.deploy()) as IBT;
    await ibt.deployed();
  });

  it("Owner can mint tokens", async function () {
    await ibt.mint(owner.address, 100);
    const balance = await ibt.balanceOf(owner.address);
    expect(balance).to.equal(100);
  });

  it("Non-owner cannot mint tokens", async function () {
    await expect(
      ibt.connect(addr1).mint(addr1.address, 100)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Owner can burn tokens", async function () {
    await ibt.mint(owner.address, 200);
    await ibt.burn(owner.address, 100);
    const balance = await ibt.balanceOf(owner.address);
    expect(balance).to.equal(100);
  });
});

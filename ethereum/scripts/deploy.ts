import { ethers } from "hardhat";

async function main() {
  const IBT = await ethers.getContractFactory("IBT");
  const ibt = await IBT.deploy();
  await ibt.deployed();

  console.log("IBT deployed to:", ibt.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

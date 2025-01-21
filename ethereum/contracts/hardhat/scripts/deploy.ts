import { ethers } from "hardhat";

async function main() {
  const IBT = await ethers.getContractFactory("IBT");
  const ibt = await IBT.deploy();
  // așteptăm confirmarea deploy-ului
  await ibt.waitForDeployment();

  // Adresa contractului
  const contractAddress = await ibt.getAddress();
  console.log("IBT deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

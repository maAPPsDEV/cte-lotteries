import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import { GuessTheSecretNumberChallenge } from "../typechain";

const deployFunc: DeployFunction = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("GuessTheSecretNumberChallenge", {
    from: deployer,
    args: [],
    log: true,
    value: ethers.utils.parseEther("1"),
  });
};

export default deployFunc;
deployFunc.tags = ["GuessTheSecretNumberChallenge"];
deployFunc.dependencies = [];

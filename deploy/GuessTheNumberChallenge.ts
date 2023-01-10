import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import { GuessTheNumberChallenge } from "../typechain";

const deployFunc: DeployFunction = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("GuessTheNumberChallenge", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployFunc;
deployFunc.tags = ["GuessTheNumberChallenge"];
deployFunc.dependencies = [];

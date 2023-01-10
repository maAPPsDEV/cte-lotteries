import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber, constants } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { GuessTheNumberChallenge } from "../typechain";

chai.use(solidity);

describe("GuessTheNumberChallenge", () => {
  let deployer: SignerWithAddress;
  let hacker: SignerWithAddress;
  let challenge: GuessTheNumberChallenge;

  before(async () => {
    await deployments.fixture(["GuessTheNumberChallenge"]);
    deployer = await ethers.getSigner((await getNamedAccounts()).deployer);
    hacker = await ethers.getSigner((await getNamedAccounts()).hacker);
    challenge = await ethers.getContract("GuessTheNumberChallenge");
  });

  it("should guess the number", async () => {
    // Verify initial status
    expect(await challenge.isComplete()).to.be.false;
    const prevHackerBal = await hacker.getBalance();

    // Guess
    await challenge.connect(hacker).guess(BigNumber.from("42"), {
      value: ethers.utils.parseEther("1"),
    });

    // Verify post status
    const postHackerBal = await hacker.getBalance();
    expect(postHackerBal).to.be.gt(prevHackerBal);
    const challengeBal = await ethers.provider.getBalance(challenge.address);
    expect(challengeBal).to.be.equal(0);
    expect(await challenge.isComplete()).to.be.true;
  });
});

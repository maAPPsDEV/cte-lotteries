import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";

import { GuessTheRandomNumberChallenge } from "../typechain";

chai.use(solidity);

describe("GuessTheRandomNumberChallenge", () => {
  let deployer: SignerWithAddress;
  let hacker: SignerWithAddress;
  let challenge: GuessTheRandomNumberChallenge;
  let snapshotId: number;

  beforeEach(async () => {
    snapshotId = await network.provider.send("evm_snapshot");
    await deployments.fixture(["GuessTheRandomNumberChallenge"]);
    deployer = await ethers.getSigner((await getNamedAccounts()).deployer);
    hacker = await ethers.getSigner((await getNamedAccounts()).hacker);
    challenge = await ethers.getContract("GuessTheRandomNumberChallenge");
  });

  afterEach(async () => {
    await network.provider.send("evm_revert", [snapshotId]);
  });

  it("should guess the secret number by reading contract's storage", async () => {
    // Verify initial status
    expect(await challenge.isComplete()).to.be.false;
    const prevHackerBal = await hacker.getBalance();

    // Guess
    const answer = await ethers.provider.getStorageAt(challenge.address, 0);
    console.log("answer:", answer);
    const [guessNumber] = ethers.utils.defaultAbiCoder.decode(
      ["uint8"],
      answer
    );
    console.log("guess number:", guessNumber);
    await challenge.connect(hacker).guess(guessNumber, {
      value: ethers.utils.parseEther("1"),
    });

    // Verify post status
    const postHackerBal = await hacker.getBalance();
    expect(postHackerBal).to.be.gt(prevHackerBal);
    const challengeBal = await ethers.provider.getBalance(challenge.address);
    expect(challengeBal).to.be.equal(0);
    expect(await challenge.isComplete()).to.be.true;
  });

  it("should guess the secret number by combining block params", async () => {
    console.log(
      "no programmatic way to get block number which the contract deployed on"
    );
  });
});

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { GuessTheSecretNumberChallenge } from "../typechain";

chai.use(solidity);

describe("GuessTheSecretNumberChallenge", () => {
  let deployer: SignerWithAddress;
  let hacker: SignerWithAddress;
  let challenge: GuessTheSecretNumberChallenge;

  before(async () => {
    await deployments.fixture(["GuessTheSecretNumberChallenge"]);
    deployer = await ethers.getSigner((await getNamedAccounts()).deployer);
    hacker = await ethers.getSigner((await getNamedAccounts()).hacker);
    challenge = await ethers.getContract("GuessTheSecretNumberChallenge");
  });

  it("should guess the secret number", async () => {
    // Verify initial status
    expect(await challenge.isComplete()).to.be.false;
    const prevHackerBal = await hacker.getBalance();

    // Guess
    const answerHash = await challenge.answerHash();
    for (let i = 0; i < 256; i++) {
      const hash = ethers.utils.solidityKeccak256(["uint8"], [i]);
      if (answerHash === hash) {
        console.log("guess number:", i);
        await challenge.connect(hacker).guess(i, {
          value: ethers.utils.parseEther("1"),
        });
        break;
      }
    }

    // Verify post status
    const postHackerBal = await hacker.getBalance();
    expect(postHackerBal).to.be.gt(prevHackerBal);
    const challengeBal = await ethers.provider.getBalance(challenge.address);
    expect(challengeBal).to.be.equal(0);
    expect(await challenge.isComplete()).to.be.true;
  });
});

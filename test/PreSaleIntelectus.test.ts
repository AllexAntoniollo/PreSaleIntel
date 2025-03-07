import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("PreSaleIntelectus", function () {
  this.timeout(60000000); 
  async function deployFixture() {

    const Intel = await ethers.getContractFactory("Intel");
    const intel = await Intel.deploy();
    const intelAddress = await intel.getAddress();

    const USDT = await ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy();
    const usdtAddress = await usdt.getAddress();

    const UniswapOracle = await ethers.getContractFactory("UniswapOracle");
    const uniswapOracle = await UniswapOracle.deploy();
    const uniswapOracleAddress = await uniswapOracle.getAddress();
    
    


    const [owner, otherAccount,another] = await ethers.getSigners();
    const PreSaleIntelectus = await ethers.getContractFactory("PreSaleIntelectus");
    const presale = await PreSaleIntelectus.deploy(intelAddress,otherAccount.address,usdtAddress,usdtAddress,ethers.parseEther("0.05"),uniswapOracleAddress);
    const presaleAddress = await presale.getAddress();

    await intel.mint(otherAccount.address,ethers.parseUnits("1000000","ether"))
    await intel.connect(otherAccount).approve(presaleAddress,ethers.parseUnits("1000000","ether"))
    await usdt.mint(owner.address,ethers.parseUnits("1001"))
    await usdt.approve(presaleAddress,ethers.parseUnits("1001"))






    return {
      owner,
      otherAccount,
      usdt,another,presale,presaleAddress,intel
      };
  }

  it("Should buy pre sale", async function () {
    const {
      owner,
      otherAccount,
      usdt,presale,presaleAddress,intel
    } = await loadFixture(deployFixture);
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("1000000","ether"))

      await presale.buyTokensWithUsdt(ethers.parseUnits("1000"))
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("980000","ether"))
      expect(await usdt.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("1000"))
      expect(await usdt.balanceOf(owner.address)).to.be.equal(ethers.parseEther("1"))

      
      await presale.buyTokensWithWbnb(ethers.parseUnits("1"))
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("968000","ether"))
      expect(await usdt.balanceOf(owner.address)).to.be.equal(0)




  }); 
  it("Should buy pre sale changed price", async function () {
    const {
      owner,
      otherAccount,
      usdt,presale,presaleAddress,intel
    } = await loadFixture(deployFixture);
    await presale.setPrice(ethers.parseUnits("0.1"))
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("1000000","ether"))

      await presale.buyTokensWithUsdt(ethers.parseUnits("1000"))
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("990000","ether"))
      expect(await usdt.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("1000"))
      expect(await usdt.balanceOf(owner.address)).to.be.equal(ethers.parseEther("1"))

      
      await presale.buyTokensWithWbnb(ethers.parseUnits("1"))
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("984000","ether"))
      expect(await usdt.balanceOf(owner.address)).to.be.equal(0)

  }); 
  it("Should not buy pre sale no tokens", async function () {
    const {
      owner,
      otherAccount,
      usdt,presale,presaleAddress,intel
    } = await loadFixture(deployFixture);
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("1000000","ether"))
      await intel.connect(otherAccount).transfer(owner.address,ethers.parseUnits("1000000","ether"))
      expect(await intel.balanceOf(otherAccount.address)).to.be.equal(0)

      await expect(presale.buyTokensWithUsdt(ethers.parseUnits("1000"))).to.be.revertedWith("Not enough tokens in wallet")
 
      
      await expect(presale.buyTokensWithWbnb(ethers.parseUnits("1"))).to.be.revertedWith("Not enough tokens in wallet")


  }); 


});
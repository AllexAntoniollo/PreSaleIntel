import { ethers } from "hardhat";
import { exec } from 'child_process';

async function main() {

    const UniswapOracle = await ethers.getContractFactory("UniswapOracle");
    const uniswapOracle = await UniswapOracle.deploy();
    const uniswapOracleAddress = await uniswapOracle.getAddress();
    console.log("uniswapOracleAddress "+uniswapOracleAddress);
    
    await runCommand(uniswapOracleAddress,[])
     
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



function runCommand(address:string, params:any[]) {
  const formattedParams = params.map(param => 
    typeof param === 'string' ? `"${param}"` : param
  ).join(' ');

  const command = `npx hardhat verify --network mumbai ${address} ${formattedParams}`;

  setTimeout(() => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });
  }, 10000);  
}
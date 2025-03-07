// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol';
import '@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol';

contract UniswapOracle {
    address public poolWbnbUsdt;
    address public owner;
    address public wbnb;
    address public usdt;
    uint32 public secondsAgo = 30;
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not the contract owner');
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerChanged(address(0), owner);
    }

    function setSecondsAgo(uint32 newSeconds) external onlyOwner {
        secondsAgo = newSeconds;
    }

    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), 'New owner cannot be the zero address');
        address oldOwner = owner;
        owner = newOwner;
        emit OwnerChanged(oldOwner, newOwner);
    }

    function setWbnb(address _wbnbToken) external onlyOwner {
        require(_wbnbToken != address(0), 'Wbnb cannot be the zero address');
        wbnb = _wbnbToken;
    }

    function setUsdt(address _usdt) external onlyOwner {
        require(_usdt != address(0), 'USDT cannot be the zero address');
        usdt = _usdt;
    }

    function setPoolWbnbUsdt(uint24 _fee) external onlyOwner {
        require(wbnb != address(0), 'Wbnb address not set');
        require(usdt != address(0), 'USDT address not set');

        address _pool = IUniswapV3Factory(
            0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7
        ).getPool(wbnb, usdt, _fee);
        require(_pool != address(0), 'Pool does not exist');

        poolWbnbUsdt = _pool;
    }

    function returnPrice(uint128 amountIn) external view returns (uint) {
        // require(poolWbnbUsdt != address(0), 'Wbnb/USDT pool not set');

        // (int24 tickWbnbUsdt, ) = OracleLibrary.consult(
        //     poolWbnbUsdt,
        //     secondsAgo
        // );
        // uint amountOut = OracleLibrary.getQuoteAtTick(
        //     tickWbnbUsdt,
        //     amountIn,
        //     wbnb,
        //     usdt
        // );

        return 600 ether;
    }
}

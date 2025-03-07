// SPDX-License-Identifier: MIT
// Contact: sosia24@proton.me

pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './IUniswapOracle.sol';

contract PreSaleIntelectus is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public token;
    address public tokenWallet;
    IERC20 public usdt;
    IERC20 public wbnb;
    uint256 public priceToken;
    IUniswapOracle public oracle;

    event TokensPurchased(address indexed buyer, uint256 amount);
    event PriceUpdated(uint256 newPriceToken);

    constructor(
        address _token,
        address _tokenWallet,
        address _paymentToken1,
        address _paymentToken2,
        uint256 _priceToken,
        address _oracle
    ) Ownable(msg.sender) {
        require(_token != address(0), 'Token address cannot be zero');
        require(_oracle != address(0), 'Oracle address cannot be zero');

        require(
            _tokenWallet != address(0),
            'Token wallet address cannot be zero'
        );
        require(
            _paymentToken1 != address(0),
            'Payment token 1 address cannot be zero'
        );
        require(
            _paymentToken2 != address(0),
            'Payment token 2 address cannot be zero'
        );
        require(_priceToken > 0, 'Price for token must be greater than zero');

        token = IERC20(_token);
        tokenWallet = _tokenWallet;
        usdt = IERC20(_paymentToken1);
        wbnb = IERC20(_paymentToken2);
        priceToken = _priceToken;
        oracle = IUniswapOracle(_oracle);
    }

    function buyTokensWithUsdt(uint256 usdtValue) external nonReentrant {
        uint256 amountOut = (usdtValue * 1 ether) / priceToken;

        require(
            token.balanceOf(tokenWallet) >= amountOut,
            'Not enough tokens in wallet'
        );
        usdt.safeTransferFrom(msg.sender, tokenWallet, usdtValue);
        token.safeTransferFrom(tokenWallet, msg.sender, amountOut);
        emit TokensPurchased(msg.sender, amountOut);
    }

    function buyTokensWithWbnb(uint256 wbnbAmount) external nonReentrant {
        uint priceWbnb = oracle.returnPrice(1 ether);
        uint256 amountOut = (wbnbAmount * priceWbnb) / priceToken;
        require(
            token.balanceOf(tokenWallet) >= amountOut,
            'Not enough tokens in wallet'
        );
        wbnb.safeTransferFrom(msg.sender, tokenWallet, wbnbAmount);
        token.safeTransferFrom(tokenWallet, msg.sender, amountOut);
        emit TokensPurchased(msg.sender, amountOut);
    }

    function setPrice(uint256 _priceToken) external onlyOwner {
        require(_priceToken > 0, 'Price for token  must be greater than zero');
        priceToken = _priceToken;
        emit PriceUpdated(_priceToken);
    }
}

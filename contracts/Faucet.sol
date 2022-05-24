// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint256 public numOfFunders;
    mapping(uint256 => address) public listFunders;
    mapping(address => bool) public checkFunders;

    modifier withdrawLimit(uint256 withdrawAmount) {
        require(withdrawAmount <= 1*(10**18), "Cannot withdraw more than 1 ETH");
        _;
    }

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;

        if (!checkFunders[funder]) {
            uint256 index = numOfFunders++;
            checkFunders[funder] = true;
            listFunders[index] = funder;
        }
    }

    function getFundersIndex(uint256 index) external view returns (address) {
        return listFunders[index];
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = listFunders[i];
        }

        return _funders;
    }

    function  withdraw(uint256 withdrawAmount) external withdrawLimit(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }
}
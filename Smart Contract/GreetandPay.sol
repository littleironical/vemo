// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract GreetandPay {
    string public greeter = "Hello";

    // constructor(string memory _greeting) {
    //     greeter = _greeting;
    // }

    function greet() public view returns(string memory) {
        return greeter;
    }

    function setGreeting(string memory _greeting) public {
        greeter = _greeting;
    }

    function deposit() public payable {}
}

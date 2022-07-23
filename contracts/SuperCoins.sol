// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.1/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.1/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.7.1/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.1/utils/Counters.sol";

contract SuperCoin is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("SuperCoin", "SC") {}

    //mapping from customer address to num of supercoin mints allowed
    mapping (address => uint) cutomerSCMintNumAllowed;
    //mapping from serial num to bool
    mapping (string => bool) areSupersCoinAlreadyGiven;

    //blocking serialNum for further mint of supercoins
    function blockSerialNumForSC(string memory serialNum) external{
        areSupersCoinAlreadyGiven[serialNum] = true;
    }

    //function to raise the cutomerSCMintNumAllowed
    function raise(address customer,string memory serialNum, uint numSCInc) external {
        require(!areSupersCoinAlreadyGiven[serialNum], "Count of supercoin mint is already raised due to this serial num");
        cutomerSCMintNumAllowed[customer] += numSCInc;
    }

// to check the number of supercoins a customer is allowed to mint
    // modifier superCoinMintBal(address customer){
    //     require(cutomerSCMintNumAllowed[customer]!=0, "You are not eligible to mint supercoins");
    //     _;
    // }

// mapping to tell how many supercoins does one customer has
    mapping (address => uint[]) public ownerToSuperCoins;

    //Event : to return the number of supercoins on frontend
    event superCoinsEvent(uint);

    // Function to return number of supercoins of an address
    function getNumSuperCoin(address customer) public{
        emit superCoinsEvent(ownerToSuperCoins[customer].length);
    }

    function safeMint(address to) external{
        require(cutomerSCMintNumAllowed[to]!=0, "You are not eligible to mint supercoins");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        ownerToSuperCoins[to].push(tokenId);
        cutomerSCMintNumAllowed[to]--;
    }

    function burnSC(uint numSuperCoins) external{
        for(uint i=0; i< numSuperCoins; i++){
            uint tokenId = ownerToSuperCoins[msg.sender][ownerToSuperCoins[msg.sender].length-1];
            ownerToSuperCoins[msg.sender].pop();
            _burn(tokenId);
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol";

contract Product is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Product", "PDCT") {}

    //Struct for Purchasing History
    struct purchasingHistory{
        address ownerAdd;
        uint purchaseDate;
    }


    enum status {OPEN,CLOSE}
    //Struct for warranty claims
    struct warrantyClaim{
        status warrantyStatus;
        uint32 dateOfTicketOpening;
        uint32 dateOfTicketClosing;
        string complaint;
        string redressal;
    }

    //mapping for Purchasing history
    //todo: think about access modifier
    mapping(string => purchasingHistory[]) public serialNumToPurchasingHistory;

    //mapping for warranty
    //todo: think about access modifier
    mapping(string => warrantyClaim[]) public serialNumToWarrantyClaims;

    //mapping for serialNum to current warranty period
    //todo: think about access modifier
    mapping(string => uint) public serialNumToCurrentWarrantyPeriod;
 
    //Event to notify minting is completed
    //todo: what values to emit??
    event NotifyMint(address);

    // modifier to check if warranty can be claimed or not
    modifier isValid(string memory serialNum){
        require(serialNumToPurchasingHistory[serialNum][0].purchaseDate + serialNumToCurrentWarrantyPeriod[serialNum] >= block.timestamp, "Your warranty has expired" );
        _;
    }
    // modifier to check whether the latest owner is claiming the warranty or not
    modifier isOwner(string memory serialNum){
        require(serialNumToPurchasingHistory[serialNum][serialNumToPurchasingHistory[serialNum].length -1].ownerAdd == msg.sender, "You are not the current owner");
        _;
    }
    // modifier to check whether Flipkart is making the change
    
    modifier isFlipkart(){
        require(msg.sender == 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, "Only flipkart can make this change");
        _;
    }

    // to check the validity of warranty
    function checkValidity(string memory serialNum) view external returns (bool){
        if(serialNumToPurchasingHistory[serialNum][0].purchaseDate + serialNumToCurrentWarrantyPeriod[serialNum] >= block.timestamp){ 
            return true;
        }else{
            return false;
        }
    }

    //Custom mint function
    // to is coming from IPFS file generated during order and thus we are checking whther the adress given during order placement is same as the one with which it is claimed
    // Test : Not recieving error message 
    function safeMint(address to, string memory uri, string memory serialNum, uint warrantyPeriod, uint purchaseDate) external returns(uint){
        require(to == msg.sender, "You are not authorized to mint this NFT");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        serialNumToPurchasingHistory[serialNum].push(purchasingHistory(to,purchaseDate));
        serialNumToCurrentWarrantyPeriod[serialNum] = warrantyPeriod;
        emit NotifyMint(to);
        return tokenId;
    }

    // Function to see the list of all the items owned by a customer
    // todo: think about access modifier
    // Test : NOT PASSING

    function showMyItems(address owner) view external returns(string[] memory){
        string[] memory listOfTokenURIs; 
        for(uint i=0; i < balanceOf(owner); i++){
            listOfTokenURIs[i] = tokenURI(tokenOfOwnerByIndex(owner, i));
        }
        return listOfTokenURIs;
    }

    // get purchasing history by serial number
    function getPurchasingHistory(string memory serialNum) view external returns(purchasingHistory[] memory){
        return serialNumToPurchasingHistory[serialNum];
    }

    // get warranty claims history by serial number
    function getWarrantyClaims(string memory serialNum) view external returns(warrantyClaim[] memory){
        return serialNumToWarrantyClaims[serialNum];
    }

    //customer claims the warranty
    //Test : 
    function claimWarranty(string memory serialNum, string memory complaint) external isValid(serialNum) isOwner(serialNum){
        serialNumToWarrantyClaims[serialNum].push(warrantyClaim(status.OPEN, uint32(block.timestamp), 0, complaint, ""));
    }

    //Enterprise closes the warranty claim
    function closeWarrantyTicket(string memory serialNum, string memory redressal) external isFlipkart(){
        serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims[serialNum].length - 1].warrantyStatus = status.CLOSE;
        serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims[serialNum].length - 1].dateOfTicketClosing = uint32(block.timestamp);
        serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims[serialNum].length - 1].redressal = redressal;
    }

    // transfer ownership 
    function transferOwnership(address to, uint tokenId, string memory serialNum, bool isSBT) external isOwner(serialNum){
        require(!isSBT, "Your token is a SoulBound token");
        _beforeTokenTransfer(msg.sender, to, tokenId);
        safeTransferFrom(msg.sender, to, tokenId);
        serialNumToPurchasingHistory[serialNum].push(purchasingHistory(to,uint32(block.timestamp)));
        emit Transfer(msg.sender, to, tokenId);
    }

    //function to extend warranty
    function extendWarranty(string memory serialNum, uint newWarrantyPeriod) external isFlipkart(){
        serialNumToCurrentWarrantyPeriod[serialNum] = newWarrantyPeriod;
    }


    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

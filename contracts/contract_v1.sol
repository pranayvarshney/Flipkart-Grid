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

    //Struct for warranty claims
    struct warrantyClaim{
        enum status{ OPEN, CLOSE };
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
        require(serialNumToPurchasingHistory[serialNum][0].purchaseDate + serialNumToCurrentWarrantyPeriod[serialNum] >= now );
        _;
    }

    // to check the validity of warranty
    function checkValidity(string memory serialNum) public returns (bool){
        if(serialNumToPurchasingHistory[serialNum][0].purchaseDate + serialNumToCurrentWarrantyPeriod[serialNum] >= now){ 
        return true;
        }else{
        return false;
        }
    }

    //Custom mint function
    function safeMint(address to, string memory uri, string memory serialNum, uint memory warrantyPeriod, uint memory purchaseDate) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        serialNumToPurchasingHistory[serialNum].push(purchasingHistory(to,purchaseDate));
        serialNumToCurrentWarrantyPeriod[serialNum] = warrantyPeriod;
        emit NotifyMint(to);
    }

    //Function to see the list of all the items owned by a customer
    //todo: think about access modifier
    function showMyItems(address memory owner) view external returns(string[] calldata){
        string[] memory listOfTokenURIs; 
        for(int i=0; i < balanceOf(owner); i++){
            listOfTokenURIs.push(tokenURI(tokenOfOwnerByIndex(i)));
        }
        return listOfTokenURIs;
    }

    // get purchasing history by serial number
    function getPurchasingHistory(string memory serialNum) view external returns(purchasingHistory[] calldata){
        return serialNumToPurchasingHistory[serialNum];
    }

    // get warranty claims history by serial number
    function getWarrantyClaims(string memory serialNum) view external isValid(serialNum) returns(warrantyClaim[] calldata){
        return serialNumToWarrantyClaims[serialNum];
    }

    //customer claims the warranty
    function claimWarranty(string memory serialNum, string memory complaint) public {
        serialNumToWarrantyClaims[serialNum].push(warranty(status.OPEN, now, 0, complaint, ""));
    }

    //Enterprise closes the warranty claim
    function closeWarrantyTicket(string memory serialNum, string memory redressal) public {
        serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims.length - 1].status = status.CLOSE;
        serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims.length - 1].dateOfTicketClosing = now;
        serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims.length - 1].redressal = redressal;
    }

    //Event for transfer of ownership
    event Transfer(address from, address to, uint256 tokenId)
    // transfer ownership 
    function transferOwnership(address memory to, uint memory tokenId, string memory serialNum){
        _beforeTokenTransfer(msg.sender, to, tokenId);
        safeTransferFrom(msg.sender, to, tokenId);
        serialNumToPurchasingHistory[serialNum].push(purchasingHistory(to,now));
        emit Transfer(msg.sender, to, tokenId);
    }

    //function to extend warranty
    function extendWarranty(string memory serialNum, uint memory newWarrantyPeriod) public{
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

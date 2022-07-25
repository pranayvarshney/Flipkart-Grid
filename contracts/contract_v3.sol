// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
 
import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol";

 
 
// Interface for the SuperCoin contract
interface SuperCoinInterface{
    function balanceOf(address owner) external view returns (uint256 balance); 
    function safeMint(address to) external;
    function raise(address customer, string memory serialNum, uint numSCInc) external;
    function blockSerialNumForSC(string memory serialNum) external;
    function burnSC(uint numSuperCoins, address customer) external;
}
 
contract Product is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable{
    using Counters for Counters.Counter;
 
    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("Product", "PDCT") {
    }

    //update warranty status
    function updateWarrantyStatus() external{
        for(uint i=0; i< serialNumArray.length; i++){
            string memory serialNum = serialNumArray[i];
            if(serialNumToCurrentWarranty[serialNum].warrantyStartDate + serialNumToCurrentWarranty[serialNum].warrantyPeriod > block.timestamp){
                serialNumToCurrentWarranty[serialNum].validity = false;
            }
        }
    }
 
    //supercoin interface
    address scAddress = 0xdd249a223B3745626108321aAC5e1E380EAfD359;
    SuperCoinInterface superCoinContract = SuperCoinInterface(scAddress);
  
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
 
    struct warranty{
        uint warrantyPeriod;
        uint warrantyStartDate;
        bool validity;
    }
    //array storing the serial number of all purchases
    string[] serialNumArray; 
 
    //mapping for Purchasing history
    mapping(string => purchasingHistory[]) internal serialNumToPurchasingHistory;
 
    //mapping for warranty
    mapping(string => warrantyClaim[]) internal serialNumToWarrantyClaims;
 
    //mapping for serialNum to current warranty period
    mapping(string => warranty) internal serialNumToCurrentWarranty;
 
    //Event to notify minting is completed
    event NotifyMint(address, uint);
 
 
 
    // modifier to check if the last claim has been already settled or not before making this new claim
    modifier isLastClaimSettled(string memory serialNum){
        if(serialNumToWarrantyClaims[serialNum].length > 0){
        require(serialNumToWarrantyClaims[serialNum][serialNumToWarrantyClaims[serialNum].length-1].warrantyStatus == status.CLOSE, "Please wait for the last claim to get settled");
        }
        _;
    }
 
    // modifier to check if warranty can be claimed or not
    modifier isValid(string memory serialNum){
        require(serialNumToCurrentWarranty[serialNum].validity, "Your warranty has expired" );
        _;
    }
    // modifier to check whether the latest owner is claiming the warranty or not
    modifier isOwner(string memory serialNum){
        require(serialNumToPurchasingHistory[serialNum][serialNumToPurchasingHistory[serialNum].length -1].ownerAdd == msg.sender, "You are not the current owner");
        _;
    }
    // modifier to check whether Flipkart is making the change 
    // Yuvraj's address
    
    modifier isFlipkart(){
        require(msg.sender == 0x7521bF23C427Ca52016Fda4709932C56D23aa487, "Only flipkart can make this change");
        _;
    }
 
    // modifier to check if the nft with a serial number is already minted
    modifier isNotMinted(string memory serialNum){
        require(serialNumToPurchasingHistory[serialNum].length == 0, "This Serial Id's NFT has already been minted" );
        _;
    } 
 
    //Event : check the validity
    event checkValidityEvent(bool);
    // to check the validity of warranty
    function checkValidity(string memory serialNum) external{
        emit checkValidityEvent(serialNumToCurrentWarranty[serialNum].validity);
    }
 
    //layality benfits event : Will tell how many supercoins (uint) to give to whom (address)
    event benefits(address,uint);
 
    //function to award benefits on different scenerios
    function awardBenefit(address to, string memory serialNum) private{
        uint sc = 0;
        if(balanceOf(to) % 3 == 0){
            sc = 5;
        }else{
            sc = 2;
        }
        emit benefits(to,sc);
        superCoinContract.raise(to, serialNum, 2);
        superCoinContract.blockSerialNumForSC(serialNum);
        for(uint i=0; i<2; i++){
            superCoinContract.safeMint(to);
        }

    } 
 
 
    //Custom mint function
    // to is coming from IPFS file generated during order and thus we are checking whther the adress given during order placement is same as the one with which it is claimed
    // Test : Not recieving error message 
    function safeMint(address to, string memory uri, string memory serialNum, uint _warrantyPeriod, uint purchaseDate) external isNotMinted(serialNum){
        require(to == msg.sender, "You are not authorized to mint this NFT");
        uint256 tokenId = _tokenIdCounter.current();
        awardBenefit(to,serialNum);
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        serialNumArray.push(serialNum);
        serialNumToPurchasingHistory[serialNum].push(purchasingHistory(to,purchaseDate));
        serialNumToCurrentWarranty[serialNum].warrantyPeriod = _warrantyPeriod;
        serialNumToCurrentWarranty[serialNum].validity = true;
        serialNumToCurrentWarranty[serialNum].warrantyStartDate = purchaseDate;
        emit NotifyMint(to, tokenId);
    }
 
    // Function to see the list of all the items owned by a customer
    // todo: think about access modifier
    // Test : NOT PASSING
 
    function showMyItems(address owner) view external returns(uint[] memory){
        uint[] memory listOfToken = new uint[](balanceOf(owner));
        
        for(uint i=0; i < balanceOf(owner); i++){
            listOfToken[i]= tokenOfOwnerByIndex(owner, uint(i));
        }
        return listOfToken;
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
    function claimWarranty(string memory serialNum, string memory complaint) external isValid(serialNum) isOwner(serialNum)  isLastClaimSettled(serialNum){
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
 
    modifier sufficientSuperCoinBalance(uint superCoinNum, address customer){
        // will check if customer has sufficient superCoin balance or not
        require(superCoinContract.balanceOf(customer) >= superCoinNum);
        _;
    }
 
    //Event for 
    event burnSuperCoins(address customer, uint numOfSuperCoins);
 
    function extendWarranty(string memory serialNum, uint newWarrantyPeriod, uint superCoinNum) external payable sufficientSuperCoinBalance(superCoinNum, msg.sender){
        address payable customer;
        customer = payable(msg.sender);
        // price = 10 supercoins
        uint price = 10000000; //Gwei equivalent of 0.01 ether
        require((msg.value * 1 gwei) >= ((price * (1 gwei)) - (superCoinNum * (1000000 gwei))) , "Insufficient Balance");
        customer.transfer(msg.value -  ((price * (1 gwei)) - (superCoinNum * (1000000 gwei))));
        serialNumToCurrentWarranty[serialNum].warrantyStartDate = block.timestamp;
        serialNumToCurrentWarranty[serialNum].warrantyPeriod = newWarrantyPeriod;
        serialNumToCurrentWarranty[serialNum].validity = true;
        superCoinContract.burnSC(superCoinNum, msg.sender);
        emit burnSuperCoins(msg.sender,superCoinNum);
    }
    //Event to return balance of the contract
    event contractBalanceEvent(uint);

    function getBalance() external returns(uint){
        emit contractBalanceEvent(address(this).balance);
        return address(this).balance;
    }

    function withdraw() external onlyOwner {
        address payable _owner = payable(address(uint160(owner())));
        _owner.transfer(address(this).balance);
  }
 
    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
 
    function _burn(uint256 tokenID) internal override (ERC721,ERC721URIStorage){
 
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
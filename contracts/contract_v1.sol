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

    mapping(string => string) serialToCust;
    // enterprise will populate this mapping

    mapping(address => uint256[]) ownerToItems;
    //map of owner to his NFTs, will be used to show list of his items on frontend

    //flipkart address
    address FLIPKART_ADDRESS = 0x7521bF23C427Ca52016Fda4709932C56D23aa487;
    modifier onlyFlipkart() {
        require(msg.sender == FLIPKART_ADDRESS);    
        _;
    }

    struct Item {
        string serialNumber;
        string productName;
        string modelNo;
        uint256 dateOfPurchase;
        uint256 dateOfExpiryOfWarranty;
    }

    constructor() ERC721("Product", "PDCT") {}

    function populateMap(string memory serialNumber, string memory custId) public onlyFlipkart {
        serialToCust[serialNumber] = custId;
    }
    //will be called by flipkart when order is placed

    function _baseURI() internal pure override returns (string memory) {
        return "https://someURI/";
    }

    function safeMint(address to, string memory uri, string memory serialNumber, string memory custId) public {
        require(keccak256(abi.encodePacked(serialToCust[serialNumber])) == keccak256(abi.encodePacked(custId)), "You are not authorized to mint this NFT");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        ownerToItems[to].push(tokenId);
    }

    function listNFTsOfOwner(address _owner) public view onlyOwner returns (uint[] memory) {
        return ownerToItems[_owner];
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
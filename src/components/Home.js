import React, { useState, useEffect } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Button, Stack, Heading, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import abi from './abi.json'
import axios from 'axios'
import ParentComp from './ParentComp';
import Navbar from './Navbar'
const Web3 = require('web3');
function Home() {

  const toast = useToast()
  const uri = []
  const [tsid,settsid]=useState()
  const [nfts,Setnfts] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const address = (window.ethereum.selectedAddress);
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const contactAddress = process.env.REACT_APP_CONTRACT_ADDRESS;  
  const contract = new web3.eth.Contract(abi, contactAddress)
  var flag = 1;

  const mint = async() => {
    const sid = (document.getElementById('claimSID')).value
    settsid(sid)
    const data =  await axios.post('/api/sid/find', { sid:sid})
    const hash = (data.data[0].hash);
    const k = await fetch(`https://ipfs.infura.io/ipfs/${hash}`)
    const uri = await k.json()
    const validity =(await uri.validity)
    const purchaseDate = await uri.purchaseDate
    if(purchaseDate){
      contract.methods.safeMint(address, hash, sid, validity, purchaseDate)
        .send({ from: address, gas: "3000000" })
        .then((item) => {   
           console.log(item);
          toast({
            title: "NFT minted successfully",
            status: 'success',
            isClosable: true,
          })                 
         }).catch(err=>{
          console.log(err);
           toast({
             title: "Failure in Minting NFT",
             status: 'error',
             isClosable: true,
           })
         })
    }
    // 
  }
  
 contract.events.NotifyMint(async(err,res)=>{
   
   var tokenid = (res.returnValues)[1]
   await axios.put('/api/saveID', { sid: tsid, tokenID: tokenid })
   generate();
  }
  )
  contract.events.Transfer(async (err, res) => {
    generate();
  }
  )


  const generate = async () => {
    const kkk = (window.ethereum.selectedAddress);
    try{
      const myitems = await contract.methods.showMyItems(kkk).call()
      if (myitems) {
        for (var i = 0; i < myitems.length; i++) {
          var oneURI = await contract.methods.tokenURI(myitems[i]).call()
          uri.push(oneURI);
        }
        Setnfts(uri)
      }
    }
    catch(err){
      console.log(err)
    }
    
  }
  useEffect(() => {
   
    generate()
  }, []);

  return (
    <>
      <Navbar   />
      <Stack spacing={4}>
        
        <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'} width={'100%'} rowGap={8} columnGap={24} >
         
         <ParentComp uri={nfts} />
          
        </Stack>
      </Stack>

      <Button
        onClick={onOpen}
        position={'fixed'}
        top={'85vh'}
        left={'85vw'}
        variant={'solid'}
        colorScheme={'teal'}
        size={'lg'}
        mr={4}
        leftIcon={<AddIcon />}
      >
        Claim NFT
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'3xl'} >Claim NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="claimSID">
              <FormLabel>Enter product serial ID</FormLabel>
              <Input type="text" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={mint}>
              Claim
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Home
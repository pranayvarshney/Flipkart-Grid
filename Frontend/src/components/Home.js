import React, { useState, useEffect } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Button, Stack, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  Center,
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
import Lottie from 'lottie-react'
import emptyBox from '../empty.json'
import axios from 'axios'
import ParentComp from './ParentComp';
import Navbar from './Navbar'
import NFTcardtest from './NFTcardtest'
const Web3 = require('web3');




function LottieWrapper() {
  const style = {
    height: 400,
    opacity: 0.8,
  };
  return (
    <Stack spacing={10}>
      <Lottie animationData={emptyBox} loop={true} style={style} />;
      <Text fontSize={'3xl'}>Use the Claim NFT to claim your first product warranty</Text>
    </Stack>
  )
}

function Home() {

  const toast = useToast()
  const uri = []
  const [tsid, settsid] = useState()
  const [nfts, Setnfts] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const address = (window.ethereum.selectedAddress);
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const contactAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contract = new web3.eth.Contract(abi, contactAddress)
  var flag = 1;

  const mint = async () => {
    const sid = (document.getElementById('claimSID')).value
    settsid(sid)
    const data = await axios.post('/api/sid/find', { sid: sid })
    const hash = (data.data[0].hash);
    const k = await fetch(`https://ipfs.infura.io/ipfs/${hash}`)
    const uri = await k.json()
    const validity = (await uri.validity)
    const purchaseDate = await uri.purchaseDate
    if (purchaseDate) {
      contract.methods.safeMint(address, hash, sid, validity, purchaseDate)
        .send({ from: address, gas: "3000000" })
        .then((item) => {
          console.log(item);
          toast({
            title: "NFT minted successfully",
            status: 'success',
            isClosable: true,
          })
        }).catch(err => {
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

  contract.events.NotifyMint(async (err, res) => {

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
    try {
      const kkk = await window.ethereum.request({ method: 'eth_accounts' });
      if(kkk){
        const myitems = await contract.methods.showMyItems(kkk[0]).call()
        if (myitems) {
          for (var i = 0; i < myitems.length; i++) {
            var oneURI = await contract.methods.tokenURI(myitems[i]).call()
            uri.push(oneURI);
          }
          Setnfts(uri)
        }
      }
      
    }
    catch (err) {
      console.log(err)
    }

  }
  useEffect(() => {

    generate()
  }, []);

  return (
    <>
      <Navbar />
      <Stack minH={'100vh'} height={'fit-content'} backgroundColor={'#36096d'} background={"linear-gradient(315deg, #9921E8 0%, #5F72BE 74%)"} p={50}>
        <Center>
          <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'baseline'} flexWrap={'wrap'} width={'100%'} rowGap={8} columnGap={24} >
            {nfts && nfts.length > 1 ? <ParentComp uri={nfts} /> : <LottieWrapper/> }
          {/* <NFTcardtest/> */}
          </Stack>
        </Center>
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
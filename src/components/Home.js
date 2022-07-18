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
} from '@chakra-ui/react'
import abi from './abi.json'
import ParentComp from './ParentComp';
const Web3 = require('web3');
function Home() {
  // const test = async () =>{
  //   const data =  await axios.post('/api/sid/find', { sid:"12349iuawrdtg25"})
  //   console.log(data)

  // }
  // test()

  const uri = []
  const [nfts,Setnfts] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const address = (window.ethereum.selectedAddress);
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const contactAddress = "0x71b49E86710a3D22F6BE1dA493d691aAC1f71Fae";
  
  const contract = new web3.eth.Contract(abi, contactAddress)
  const mint = () => {
    contract.methods.safeMint(address, "QmXNRigf3q2ECs3wZJHriRiZLV1a67yBuSrnz6B7BjrjAb", "993445dfgrdtg25", 16580085, 1658085066)
      .send({ from: address, gas: "3000000" })
      .then((item) => { console.log(item) }).catch(err => console.log(err))

  }

  const generate = async () => {

    const myitems = await contract.methods.showMyItems(address).call()

    if (myitems) {
      for (var i = 0; i < myitems.length; i++) {
        var oneURI = await contract.methods.tokenURI(myitems[i]).call()
        uri.push(oneURI);
      }
      Setnfts(uri)
    } 

  }
  useEffect(() => {
    console.log("running")
    generate()
  }, []);

  return (
    <>
      <Stack spacing={4}>
        <Heading
          lineHeight={1.5}
          width={'fit-content'}
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '7xl' }}
          ml={20}
          mt={8}
          bgGradient="linear(to-r, purple.500, cyan.400)"
          bgClip="text"
        >

          My NFTs {' '}
        </Heading>
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
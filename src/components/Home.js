import React from 'react'
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
import NFTcard from './NFTcard';
function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
 
  const address = (window.ethereum.selectedAddress);
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
          <NFTcard />
          <NFTcard />
          <NFTcard />
          <NFTcard />
          <NFTcard />
          <NFTcard />
          <NFTcard />
          <NFTcard />
          <NFTcard />
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
            <Button colorScheme='green' mr={3}>
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
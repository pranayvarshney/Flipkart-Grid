import React from 'react'
import {
    Button, Stack, Heading,
    Text,
    HStack,
    Box,
    Image,
} from '@chakra-ui/react'
function NFTcardtest() {
  return (
      <Stack
          pb={10}
          className='card'
          borderWidth="1px"
          borderRadius="5%"
          minH={"fit-content"}
          justifyContent={'center'}
          alignItems={'center'}
          w={{ sm: "100%", md: "550px", lg: "400px" }}
          height={{ sm: "476px", md: "fit-content", lg: "fit-content" }}
          direction={{ base: "column", md: "column" }}
          boxShadow={"2xl"}
          position={'relative'}
      >
          <Heading zIndex={10} p={4} fontSize={"4xl"} fontWeight={'medium'} fontFamily={"body"}>
              Product Name
          </Heading>
          <Box width={'100%'}  >
              <Image opacity={0.8} height={'250px'} width={'100%'} src="http://ipfs.infura.io/ipfs/QmewJDPvXo7pa7JVqqgwdVu2F4UzsfHUNw6BPVSzp2YuGT" alt='Dan Abramov' />
          </Box>
          <Text textAlign={"center"}
              zIndex={10}
              px={3}>
              lorem20
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur molestiae earum, labore tempore sapiente cumque recusandae fuga numquam magni ratione!
          </Text>
          <Button
              top={'270px'}
              right={10}
              position={'absolute'}
              colorScheme="red"
              size="md"
          >
              Claim Warranty
          </Button>
          <HStack>
              <Button
                  colorScheme="blue"
                  size="md"
              >
                  Transfer
              </Button>
              <Button
                  colorScheme="blue"
                  size="md"
              >
                  History
              </Button>
          </HStack>
          <Box className={'vertical'} height={'250px'} zIndex={-999} width={'50px'} backdropFilter={"blur(5px)"} background={"rgba(231, 231, 231, 0.348)"} position={'absolute'} bottom={'192px'} right={'-51px'}>
              <Text pt={20} fontSize={'4xl'}>Valid
              </Text>
          </Box>
      </Stack>
  )
}

export default NFTcardtest
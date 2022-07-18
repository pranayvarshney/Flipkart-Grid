import { Badge, TableContainer, Tr, Thead, Table, Th, Tbody, Td, Tfoot, TableCaption, Wrap, WrapItem, Button, Center, Flex, Heading, Image, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, ModalOverlay, ModalContent, ModalHeader, Modal, FormControl, FormLabel, Input, Link, Stack, Text, useColorModeValue, VStack, HStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import abi from './abi.json'
const Web3 = require('web3');
export default function NFTcard({ prop }) {
    const [data, setData] = useState()
    var owner = []
    var purchas = []
    const [ownerAdd, setOwnerAdd] = useState()
    const [purchaseD, setPurchaseD] = useState()
    const details = async () => {
        const k = await fetch(`https://ipfs.infura.io/ipfs/${prop}`)

        setData(await k.json())

    }

    useEffect(() => {

        details()
    }, []);
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contactAddress = "0x71b49E86710a3D22F6BE1dA493d691aAC1f71Fae";

    const contract = new web3.eth.Contract(abi, contactAddress)


    const getPurchasingHistory = () => {
        contract.methods.getPurchasingHistory("12349iuawrdtg25").call().then((item) => {
            for (var i = 0; i < item.length; i++) {
                owner.push(item[i].ownerAdd)
                purchas.push(item[i].purchaseDate)
            }
            setOwnerAdd(owner)
            setPurchaseD(purchas)
            console.log(owner);
            console.log(purchas);

        }).catch(err => console.log(err))
    }

    var isValid = true;
    const { isOpen: isTransferOpen, onOpen: onTransferOpen, onClose: onTransferClose } = useDisclosure()
    const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure()
    const { isOpen: isClaimOpen, onOpen: onClaimOpen, onClose: onClaimClose } = useDisclosure()
    return (
        <Center py={6}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '540px', lg: '500px' }}
                height={{ sm: '476px', md: '20rem', lg: 'fit-content' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                padding={4}>
                <Flex flex={1} bg="blue.200"
                >
                    <Image
                        objectFit="cover"
                        boxSize="100%"
                    // src={data&&data.image}
                    />
                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={1}
                    pt={2}>
                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {data && data.name}
                    </Heading>
                    <Link fontWeight={600} color={'gray.500'} size="sm" mb={4} href={data && data.pageURL}>
                        {data && data.pageURL}
                    </Link>
                    <Text
                        textAlign={'center'}
                        color={useColorModeValue('gray.700', 'gray.400')}
                        px={3}>
                        {data && data.description}
                    </Text>

                    <Badge
                        px={2}
                        py={1}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        fontWeight={'400'}>
                        SID- {data && data.sid}
                    </Badge>
                    <Badge
                        px={1}
                        py={1}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        fontWeight={'600'}
                        fontSize={'lg'}
                        width={'fit-content'}
                        alignItems={'center'}
                    >
                        Warranty {' '} {isValid ? <Text color={'green.300'} ml={5}>valid</Text> : <Text ml={3} color={'red'}>Invalid</Text>}
                    </Badge>

                    <Stack>
                        <Wrap spacing={4}>
                            <WrapItem>
                                <Button colorScheme='teal' size='xs' onClick={() => {
                                    onHistoryOpen()
                                    getPurchasingHistory()
                                }}   >Owner History</Button>
                            </WrapItem>
                            <WrapItem>
                                <Button colorScheme='teal' size='xs' onClick={onClaimOpen}>Claims History</Button>
                            </WrapItem>
                        </Wrap>
                    </Stack>
                    <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}>
                        <Button
                            onClick={onTransferOpen}
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }}>
                            Transfer
                        </Button>
                    </Stack>
                    <Modal isOpen={isTransferOpen} onClose={onTransferClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={'3xl'} >Transfer NFT</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl id="claimSID">
                                    <FormLabel>Enter receiver's address</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='purple' mr={3}>
                                    Transfer
                                </Button>
                                <Button colorScheme='blue' mr={3} onClick={onTransferClose}>
                                    Close
                                </Button>

                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={isHistoryOpen} onClose={onHistoryClose} size={'xl'}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={'3xl'} >Owner History</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>

                                <TableContainer>
                                    <Table variant='simple'>
                                        <TableCaption>History of Old Owners</TableCaption>
                                        <Tbody>
                                            <HStack>
                                                <VStack w={'min-content'}>
                                                    <Th>Owner Address</Th>
                                                    {ownerAdd && ownerAdd.map((item) => {
                                                        return <Td fontSize={'sm'}>{item}</Td>
                                                    })

                                                    }

                                                </VStack>
                                                <VStack w={'min-content'}>
                                                    <Th>Purchase Date</Th>
                                                    {purchaseD && purchaseD.map((item) => {
                                                        return <Td>{item}</Td>
                                                    })
                                                    }

                                                </VStack>

                                            </HStack>
                                        </Tbody>

                                    </Table>
                                </TableContainer>

                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onHistoryClose}>
                                    Close
                                </Button>

                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={isClaimOpen} onClose={onClaimClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={'3xl'} >Claims History</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                Claims
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClaimClose}>
                                    Close
                                </Button>

                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Stack>
            </Stack>
        </Center>
    );
}
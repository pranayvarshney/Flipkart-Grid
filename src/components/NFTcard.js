import {
    Badge,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Modal,
    FormControl,
    FormLabel,
    Input,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

export default function NFTcard() {
    var isValid = true;
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Center py={6}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '540px',lg:'500px' }}
                height={{ sm: '476px', md: '20rem' ,lg:'fit-content'}}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                padding={4}>
                <Flex flex={1} bg="blue.200"
                >
                    <Image
                        objectFit="cover"
                        boxSize="100%"
                        src={
                            'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'
                        }
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
                        Product Name
                    </Heading>
                    <Link fontWeight={600} color={'gray.500'} size="sm" mb={4} href={'https://pageurl.com'}>
                        https://pageurl.com
                    </Link>
                     <Text
                        textAlign={'center'}
                        color={useColorModeValue('gray.700', 'gray.400')}
                        px={3}>
                        product description Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto libero laborum quis 
                         me in your posts
                    </Text>
                   
                        <Badge
                            px={2}
                            py={1}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            fontWeight={'400'}>
                           SID- Lorem ipsum dolor 
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
                        Warranty {' '} {isValid?<Text color={'green.300'} ml={5}>valid</Text>:<Text ml={3} color={'red'}>Invalid</Text>}
                    </Badge>
                    
                      
                    <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}>
                       <Button
                       onClick={onOpen}
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
                    <Modal isOpen={isOpen} onClose={onClose}>
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
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
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
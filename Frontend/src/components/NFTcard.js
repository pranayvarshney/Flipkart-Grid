import {
    Badge,
    TableContainer,
    Tr,
    Thead,
    HStack,
    VStack,
    Table,
    Th,
    Divider,
    Tbody,
    Td,
    TableCaption,
    Wrap,
    WrapItem,
    Tab, Tabs,
    TabList,
    TabPanels, TabPanel,
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
    useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import abi from "./abi.json";
import { RepeatClockIcon, ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons'
import { BiWrench } from 'react-icons/bi';
const Web3 = require("web3");

export default function NFTcard({ prop }) {
    const [data, setData] = useState();

    const toast = useToast();
    const [enddate, setEnddate] = useState()
    const [claims, setClaims] = useState();
    const [purchaseD, setPurchaseD] = useState();
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contactAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

    const contract = new web3.eth.Contract(abi, contactAddress);
    const [isValid, setValid] = useState(true);

    const details = async () => {
        const k = await fetch(`https://ipfs.infura.io/ipfs/${prop}`);
        setData(await k.json());
    };

    useEffect(() => {
        details();
    }, []);
    useEffect(() => {
        if (data) {
            checkValidity(data.sid);
            getEndDate(data.sid)
        }
    }, [data]);

    const transfer = async () => {
        onTransferOpen();
    };

    const handleBurn = async () => {
        console.log("burn started")
        try {
            const kk = await axios.post("/api/sid/find", { sid: data.sid });
            const address = window.ethereum.selectedAddress;
            const tokenID = await kk.data[0].tokenID;
            await contract.methods
                .burn(tokenID)
                .send({ from: address, gas: "3000000" });
            toast({
                title: "NFT burned successfully",
                status: "success",
                isClosable: true,
            });
        }
        catch (err) {
            console.log(err)
            toast({
                title: "Burn Failed",
                status: "error",
                isClosable: true,
            });
        }
    }
    const handleTranfer = async () => {
        try {
            const kk = await axios.post("/api/sid/find", { sid: data.sid });
            const address = window.ethereum.selectedAddress;
            const tokenID = await kk.data[0].tokenID;
            const resA = document.getElementById("transferSID").value;
            console.log(tokenID);
            await contract.methods
                .transferOwnership(resA, tokenID, data.sid, false)
                .send({ from: address, gas: "3000000" });
            toast({
                title: "Transfer Successfully",
                status: "success",
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Transfer Failed",
                status: "error",
                isClosable: true,
            });
        }
    };

    const checkValidity = async (sid) => {
        console.log("this started")
        const vali = await contract.methods.checkValidity(sid).call();
        setValid(vali);
    };

    const getPurchasingHistory = (sid) => {
        contract.methods
            .getPurchasingHistory(sid)
            .call()
            .then((item) => {
                var purchas = [];
                for (var i = 0; i < item.length; i++) {
                    var dt = item[i].purchaseDate * 1000;
                    const dateObj = new Date(dt);

                    var obj = {
                        ownerAddress: item[i].ownerAdd,
                        dateOfPurchase: dateObj.toLocaleString(),
                    };
                    purchas.push(obj);
                }

                setPurchaseD(purchas);
            })
            .catch((err) => console.log(err));
    };

    const getClaimHistory = (sid) => {
        contract.methods
            .getWarrantyClaims(sid)
            .call()
            .then((item) => {
                var claims = [];

                for (var i = 0; i < item.length; i++) {
                    var odate = new Date(item[i].dateOfTicketClosing * 1000);
                    odate = odate.toLocaleString();
                    var pdate = new Date(item[i].dateOfTicketOpening * 1000);
                    pdate = pdate.toLocaleString();
                    if (item[i].dateOfTicketClosing == 0) {
                        odate = "not closed";
                    }
                    var redressal = item[i].redressal;
                    if (redressal === "") {
                        redressal = "No comments made yet";
                    }
                    var obj = {
                        complaint: item[i].complaint,
                        dateOfTicketClosing: odate,
                        dateOfTicketOpening: pdate,
                        redressal: redressal,
                        warrantyStatus: item[i].warrantyStatus,
                    };
                    claims.push(obj);
                }
                setClaims(claims);
            })
            .catch((err) => console.log(err));
    };

    const claimWarranty = async (sid) => {
        const address = window.ethereum.selectedAddress;
        const complaint = document.getElementById("claimSID").value;
        contract.methods
            .claimWarranty(sid, complaint)
            .send({ from: address, gas: "3000000" })
            .then((item) => {
                console.log(item);
                toast({
                    title: "Successfully Claimed",
                    status: "success",
                    isClosable: true,
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Claim Failed",
                    status: "error",
                    isClosable: true,
                });
            });
    };

    const getEndDate = async (sid) => {

        const lastDate = await contract.methods.getExpiryDate(sid).call()
        console.log(lastDate)
        var dt = await new Date(lastDate * 1000)
        setEnddate(dt.toLocaleDateString())
    }

    const extend = async (sid) => {
        const address = window.ethereum.selectedAddress;
        const superCoinUsed = document.getElementById("supercoinID").value;
        await contract.methods
            .extendWarranty(sid, 31536000, superCoinUsed)
            .send({
                from: address,
                gas: "3000000",
                value: Web3.utils.toWei("0.01", "ether"),
            })
            .then((item) => {
                console.log(item);
                toast({
                    title: "Extended successfully",
                    status: "success",
                    isClosable: true,
                });
            })
            .catch((err) => {
                toast({
                    title: "Extension Failed",
                    status: "error",
                    isClosable: true,
                });
                console.log(err);
            });
    };

    const {
        isOpen: isTransferOpen,
        onOpen: onTransferOpen,
        onClose: onTransferClose,
    } = useDisclosure();
    const {
        isOpen: isHistoryOpen,
        onOpen: onHistoryOpen,
        onClose: onHistoryClose,
    } = useDisclosure();
    // const {
    //     isOpen: isClaimOpen,
    //     onOpen: onClaimOpen,
    //     onClose: onClaimClose,
    // } = useDisclosure();
    const {
        isOpen: isMakeClaimOpen,
        onOpen: onMakeClaimOpen,
        onClose: onMakeClaimClose,
    } = useDisclosure();
    const {
        isOpen: isUpgradeOpen,
        onOpen: onUpgradeOpen,
        onClose: onUpgradeClose,
    } = useDisclosure();

    return (
        <Center py={6} >
            <Stack
                borderWidth="1px"
                borderRadius={'3%'}
                minW={"fit-content"}
                minH={"fit-content"}
                w={{ sm: "100%", md: "550px", lg: "600px" }}
                height={{ sm: "476px", md: "fit-content", lg: "28rem" }}
                direction={{ base: "column", md: "row" }}
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                padding={4}
            >
                <Flex flex={1} bg="blue.200">
                    <Image objectFit="cover" boxSize="100%" src={data && data.image} />
                </Flex>
                <Stack
                    minH={"100%"}
                    flex={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={1}
                    position='relative'
                >
                    <HStack position={'absolute'} right='10px' top='-5px'>
                        <Button onClick={() => {
                            onHistoryOpen();
                            getPurchasingHistory(data.sid);
                            getClaimHistory(data.sid);
                        }}>
                            <RepeatClockIcon color={'cyan.300'} />
                        </Button>
                        <Button onClick={handleBurn}>
                            <DeleteIcon color={'red'} />
                        </Button>
                    </HStack>

                    <Heading pt={'40px'} fontSize={"3xl"} fontFamily={"body"}>
                        {data && data.name}
                    </Heading>
                    <Link
                        fontWeight={600}
                        color={"gray.500"}
                        size="sm"
                        mb={4}
                        href={data && data.pageURL}
                    >
                        Product Url
                    </Link>
                    <Text
                        textAlign={"center"}
                        color={useColorModeValue("gray.700", "gray.400")}
                        px={3}
                    >
                        {data && data.description}
                    </Text>

                    <Badge
                        px={2}
                        py={1}
                        bg={useColorModeValue("gray.50", "gray.800")}
                        fontWeight={"400"}
                    >
                        SID- {data && data.sid}
                    </Badge>
                    <VStack
                        px={1}
                        bg={useColorModeValue("gray.50", "gray.800")}
                        fontWeight={"600"}
                        fontSize={"lg"}
                        width={"fit-content"}
                        height={'200px'}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Text as='u'>
                            Warranty Status{" "}
                        </Text>
                        <Text>
                            End Date - {enddate}
                        </Text>
                        {isValid ? (
                            <Text color={"green.300"} >
                                VALID
                            </Text>
                        ) : (
                            <Text  color={"red"}>
                                INVALID
                            </Text>
                        )}
                    </VStack>

                    <Stack>
                        {/* <Wrap spacing={4}>
                            <WrapItem>
                                <Button
                                    colorScheme="teal"
                                    size="sm"
                                    onClick={() => {
                                        onHistoryOpen();
                                        getPurchasingHistory(data.sid);
                                    }}
                                >
                                    Owner History
                                </Button>
                            </WrapItem>
                            <WrapItem>
                                <Button
                                    colorScheme="teal"
                                    size="sm"
                                    onClick={() => {
                                        onClaimOpen();
                                        getClaimHistory(data.sid);
                                    }}
                                >
                                    Claims History
                                </Button>
                            </WrapItem>
                        </Wrap> */}
                    </Stack>
                    <Stack width={'80%'} rounded={'full'}>
                        <Button
                            leftIcon={<ArrowForwardIcon />}
                            onClick={() => {
                                transfer();
                            }}
                            size={'lg'}
                            bg={"blue.400"}
                            color={"white"}
                            boxShadow={
                                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                            }
                            _hover={{
                                bg: "blue.500",
                            }}
                            _focus={{
                                bg: "blue.500",
                            }}
                        >
                            Transfer
                        </Button>
                    </Stack>


                    <Stack width={'80%'} rounded={'full'}>
                        <Button
                            leftIcon={<BiWrench />}
                            colorScheme="teal"
                            size="lg"
                            onClick={() => {
                                if (isValid == false) {
                                    toast({
                                        title: "Warranty is invalid cannot claim",
                                        status: "error",
                                        isClosable: true,
                                    });
                                }
                                else {
                                    onMakeClaimOpen();
                                }
                            }}
                        >
                            Claim Warranty
                        </Button>
                    </Stack>
                    <Stack>
                        <Link

                            colorScheme="teal"
                            size="sm"
                            onClick={() => {
                                onUpgradeOpen();
                            }}
                        >
                            <Text as='u'>
                                or Upgrade

                            </Text>
                        </Link>
                    </Stack>



                    <Modal isOpen={isTransferOpen} onClose={onTransferClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={"3xl"}>Transfer NFT</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl id="transferSID">
                                    <FormLabel>Enter receiver's address</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="purple" mr={3} onClick={handleTranfer}>
                                    Transfer
                                </Button>
                                <Button colorScheme="blue" mr={3} onClick={onTransferClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={isHistoryOpen} onClose={onHistoryClose} size={"full"}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={"3xl"}>History</ModalHeader>
                            <Divider orientation='horizontal' />
                            <ModalCloseButton />
                            <ModalBody>
                                <Tabs isManual size={'lg'}>
                                    <TabList>
                                        <Tab>Owner History</Tab>
                                        <Tab>Claim History </Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>
                                            <TableContainer>
                                                <Table variant="simple">
                                                    <TableCaption>Owner Histroy</TableCaption>
                                                    <Thead>
                                                        <Tr>
                                                            <Th>Owner</Th>
                                                            <Th>Purchase Date</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {purchaseD &&
                                                            purchaseD.map((item) => {
                                                                return (
                                                                    <Tr key={item.ownerAddress}>
                                                                        <Td>{item.ownerAddress}</Td>
                                                                        <Td>{item.dateOfPurchase}</Td>
                                                                    </Tr>
                                                                );
                                                            })}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        </TabPanel>
                                        <TabPanel>
                                            <TableContainer>
                                                <Table variant="simple">
                                                    <TableCaption>Claim Histroy</TableCaption>

                                                    <Thead>
                                                        <Tr>
                                                            <Th>Complaint</Th>
                                                            <Th>Date of closing</Th>
                                                            <Th>Date of opening</Th>
                                                            <Th>Redressal</Th>
                                                            <Th>Claim Status</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {claims &&
                                                            claims.map((item) => {
                                                                return (
                                                                    <Tr>
                                                                        <Td>{item.complaint}</Td>
                                                                        <Td>{item.dateOfTicketClosing}</Td>
                                                                        <Td>{item.dateOfTicketOpening}</Td>
                                                                        <Td>{item.redressal}</Td>
                                                                        <Td>
                                                                            {item.warrantyStatus == 1 ? "Closed" : "Open"}
                                                                        </Td>
                                                                    </Tr>
                                                                );
                                                            })}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>

                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={onHistoryClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* <Modal isOpen={isClaimOpen} onClose={onClaimClose} size="full">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={"3xl"}>Claims History</ModalHeader>
                            <Divider orientation='horizontal' />
                            <ModalCloseButton />
                            <ModalBody>
                                <TableContainer>
                                    <Table variant="simple">
                                        <TableCaption>Claim Histroy</TableCaption>

                                        <Thead>
                                            <Tr>
                                                <Th>Complaint</Th>
                                                <Th>Date of closing</Th>
                                                <Th>Date of opening</Th>
                                                <Th>Redressal</Th>
                                                <Th>Claim Status</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {claims &&
                                                claims.map((item) => {
                                                    return (
                                                        <Tr>
                                                            <Td>{item.complaint}</Td>
                                                            <Td>{item.dateOfTicketClosing}</Td>
                                                            <Td>{item.dateOfTicketOpening}</Td>
                                                            <Td>{item.redressal}</Td>
                                                            <Td>
                                                                {item.warrantyStatus == 1 ? "Closed" : "Open"}
                                                            </Td>
                                                        </Tr>
                                                    );
                                                })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={onClaimClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal> */}
                    <Modal isOpen={isMakeClaimOpen} onClose={onMakeClaimClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={"3xl"}>Make A Claim</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl id="claimSID">
                                    <FormLabel>Enter ticket request in brief</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme={"green"}
                                    mr={3}
                                    onClick={() => {


                                        claimWarranty(data.sid);

                                    }}
                                >
                                    Proceed
                                </Button>
                                <Button colorScheme="blue" mr={3} onClick={onMakeClaimClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader fontSize={"3xl"}>Upgrade warranty</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl id="supercoinID">
                                    <FormLabel>
                                        Enter how many supercoins you want to use?
                                    </FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme={"green"}
                                    mr={3}
                                    onClick={() => {
                                        extend(data.sid);
                                    }}
                                >
                                    Proceed
                                </Button>
                                <Button colorScheme="blue" mr={3} onClick={onUpgradeClose}>
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

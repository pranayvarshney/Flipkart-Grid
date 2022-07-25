import { Heading, Stack, Input, FormControl, FormLabel, Button, useToast } from '@chakra-ui/react'
import React from 'react'
import abi from './abi.json'
const Web3 = require('web3');
function Ticket() {
    const address = (window.ethereum.selectedAddress);
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contactAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(abi, contactAddress)
    const toast = useToast()

    const handleSubmit = () => {
        const sid = (document.getElementById('sidTicket')).value
        const redres = (document.getElementById('redres')).value
        contract.methods.closeWarrantyTicket(sid, redres)
            .send({ from: address, gas: "3000000" })
            .then((item) => {
                toast({
                    title: "Ticket Closed",
                    status: 'success',
                    isClosable: true,
                })
                console.log(item);
            }).catch(err => {
                toast({
                    title: "Error in ticket closure",
                    status: 'error',
                    isClosable: true,
                })
                console.log(err)
            })
    }


    return (
        <Stack spacing={5}
            w={'full'}
            maxW={'md'}
            bg={'gray.700'}
            p={6} >
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl', lg: '5xl' }}>
                Ticket
            </Heading>
            <Stack pt={20} spacing={10}>
                <FormControl id="sidTicket" isRequired >
                    <FormLabel>Enter product serial ID</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl id="redres" isRequired>
                    <FormLabel>Enter Redresal</FormLabel>
                    <Input type="text" />
                </FormControl>
                <Button size='md' width={'fit-content'} colorScheme='green' onClick={handleSubmit}>
                    Close Ticket
                </Button>
            </Stack>

        </Stack>
    )
}

export default Ticket
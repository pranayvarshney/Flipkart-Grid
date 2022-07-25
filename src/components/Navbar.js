import {
    Box,
    Flex,
    Link,
    Heading,
    useColorModeValue,
    Stack,
    Text
} from '@chakra-ui/react';
import axios from 'axios';
import Lottie from "lottie-react";
import {useState,useEffect} from 'react'
import coinAnimation from "../72821-gold-coin.json";
import abi from './abi.json'
const Web3 = require('web3');
const NavLink = ({children}) => (
    <Link
        fontSize={'3xl'}
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'/leaderboard'}>
        {children}
    </Link>
);

export default function Navbar() {
    const [superCoins, setsuperCoins] = useState();
    const address = (window.ethereum.selectedAddress);
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contactAddress = "0xdd249a223B3745626108321aAC5e1E380EAfD359";
    const contract = new web3.eth.Contract(abi, contactAddress)
    const style = {
        height: 50,
    };
    const fetchCoins = async()=>{
        const coins = await contract.methods.balanceOf(address).call()
        setsuperCoins(coins)
        try{
            await axios.post('/api/saveAddr', { address : address})
        }
        catch(err){
            console.log(err)
        }
    }
    useEffect(() => {       
        fetchCoins()
    }, []);

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} >
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Heading
                        lineHeight={1.5}
                        width={'fit-content'}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '5xl' }}
                        
                        bgGradient="linear(to-r, purple.500, cyan.400)"
                        bgClip="text"
                    >

                        My NFTs {' '}
                    </Heading>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'}  alignItems={'center'}>
                            <NavLink key={'leaderboard'}>Leaderboard</NavLink>
                            <Text  pl={20} fontSize={'2xl'}>{superCoins}</Text>
                            <Lottie animationData={coinAnimation} loop={true} style={style}/>;
                            
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}
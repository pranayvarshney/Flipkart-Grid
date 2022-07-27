import { useState, useEffect, useCallback } from "react";
import {
	useToast,
	Box,
	Stack,
	HStack,
	Heading,
	Text,
	VStack,
	useColorModeValue,
	List,
	ListItem,
	IconButton,
	Flex,
	Spinner,
	Divider,
} from "@chakra-ui/react";
import axios from "axios";
import Lottie from 'lottie-react'
import secondAnimation from './second.json'
import firstAnimation from './first.json'
import thirdAnimation from './third.json'
import abi from './abi.json'
const Web3 = require('web3');
const PriceWrapper = ({ children }) => {
	return (
		<Box
			mb={4}
			shadow="base"
			borderWidth="1px"
			alignSelf={{ base: "center", lg: "flex-start" }}
			borderColor={"gray.500"}
			borderRadius={"xl"}>
			{children}
		</Box>
	);
};

const Leaderboard = () => {
	const style = {
		height: 200,
	};
	const style2 = {
		height: 300,
	};
	const [listOfValues, setlistOfValues] = useState();
	const address = (window.ethereum.selectedAddress);
	const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
	const contactAddress = "0xdd249a223B3745626108321aAC5e1E380EAfD359";
	const contract = new web3.eth.Contract(abi, contactAddress)
	var arr = []
	
	var coins = []
	const v1 = "gray.700"
	const v2 = "red.700"
	const v3 = "gray.300"
	const v4 = "gray.700"
	const v5 = "gray.700"
	const fetch = async () => {
		const add = await axios.get('/api/addr/find')
		var addi = add.data
		if (addi) {

			for (var i = 0; i < addi.length; i++) {
				var obj = {
					address: addi[i].address,
					value: 0
				}
				arr.push(obj)
			}

			for (var k = 0; k < arr.length; k++) {
				const coins = await contract.methods.balanceOf(arr[k].address).call()
				arr[k].value = coins;
			}
			arr.sort((a, b) => {
				return b.value - a.value;
			})
			setlistOfValues(arr)
		}

	}
	useEffect(() => {
		fetch()
	}, []);
	return (
		<Box py={4}>
			<VStack spacing={1.5} textAlign="center">
				<Heading as="h1" fontSize="5xl" bgGradient="linear(to-r, blue.400,cyan.400)" bgClip={'text'}>
					Leaderboard
				</Heading>
			</VStack>
			<Stack
				direction={{ base: "column", md: "row" }}
				textAlign="center"
				justify="center"
				spacing={{ base: 4, lg: 10 }}
				py={10}>
				<PriceWrapper>
					<Box py={4} px={5}>
						<Text fontWeight="500" fontSize="4xl">

							<Lottie animationData={secondAnimation} loop={false} style={style} />

						</Text>
						<HStack justifyContent="center">
							<List spacing={3} textAlign="center" px={12}>
								<ListItem>Address</ListItem>
								<ListItem fontSize={'sm'}> {listOfValues && listOfValues[1].address}</ListItem>
							</List>
						</HStack>
					</Box>
					<VStack background={'#aaa9ad'} py={4} borderBottomRadius={"xl"}>
						<List spacing={3} textAlign="start" px={12}>
							<ListItem fontSize={'3xl'}>SuperCoins -{listOfValues && listOfValues[1].value}</ListItem>

						</List>
					</VStack>
				</PriceWrapper>

				<PriceWrapper>
					<Box position="relative">
						<Box
							position="absolute"
							top="-16px"
							left="50%"
							style={{ transform: "translate(-50%)" }}>
							<Text
								textTransform="uppercase"
								bg={v2}
								px={3}
								py={1}
								color={v3}
								fontSize="sm"
								fontWeight="600"
								rounded="xl">
								Winner
							</Text>
						</Box>
						<Box px={5}>
							<Lottie mt={-20} animationData={firstAnimation} loop={false} style={style2} />
							<HStack justifyContent="center">
								<List spacing={3} textAlign="center" px={12} > 
									<ListItem mt={5}>Address</ListItem>
									<ListItem mb={5} fontSize={'sm'}> {listOfValues && listOfValues[0].address}</ListItem>
								</List>
							</HStack>
						</Box>
						<VStack bg={v4} py={4} borderBottomRadius={"xl"} background={"#d4af37"}>
							<List spacing={3} textAlign="start" px={12}>
								<ListItem fontSize={'3xl'} >SuperCoins -{listOfValues && listOfValues[0].value}</ListItem>
							</List>
						</VStack>
					</Box>
				</PriceWrapper>
				<PriceWrapper>
					<Box py={4} px={5}>
						<Lottie animationData={thirdAnimation} loop={false} style={style} />
						<HStack justifyContent="center">
							<List spacing={3} textAlign="center" px={12}>
								<ListItem>Address</ListItem>
								<ListItem fontSize={'sm'}> {listOfValues && listOfValues[2].address}</ListItem>
							</List>
						</HStack>
					</Box>
					<VStack bg={'#a97142 '} py={4} borderBottomRadius={"xl"}>
						<List spacing={3} textAlign="start" px={12}>
							<ListItem fontSize={'3xl'}>SuperCoins -{listOfValues && listOfValues[2].value}</ListItem>
						</List>
					</VStack>
				</PriceWrapper>

			</Stack>
			<Text ml={10} p={10} bg={v1} width={'95vw'} fontSize={'2xl'} border={'solid 10px transparent'} borderRadius={'4%'}>
				Want more discounts and deals? Here is your chance, the top 3 customers at the end of the each week will be awarded with 50, 30 and 20 supercoins for the 1st, 2nd and 3rd positions respectively and will also get 15% discount on their next purchase. This leaderboard is updated every 5 minutes.

			</Text>
		</Box>
	);
};

export default Leaderboard;

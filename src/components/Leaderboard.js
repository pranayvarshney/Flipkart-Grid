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
import { TriangleUpIcon } from "@chakra-ui/icons";


const PriceWrapper = ({ children }) => {
	return (
		<Box
			mb={4}
			shadow="base"
			borderWidth="1px"
			alignSelf={{ base: "center", lg: "flex-start" }}
			borderColor={useColorModeValue("gray.200", "gray.500")}
			borderRadius={"xl"}>
			{children}
		</Box>
	);
};

const Leaderboard = () => {

	

	const v1 = useColorModeValue("gray.50", "gray.700");
	const v2 = useColorModeValue("red.300", "red.700");
	const v3 = useColorModeValue("gray.900", "gray.300");
	const v4 = useColorModeValue("gray.50", "gray.700");
	const v5 = useColorModeValue("gray.50", "gray.700");

	

	return (
		<Box py={4}>
			<VStack spacing={1.5} textAlign="center">
				<Heading as="h1" fontSize="4xl">
					Leaderboards
				</Heading>
			</VStack>
			<Stack
				direction={{ base: "column", md: "row" }}
				textAlign="center"
				justify="center"
				spacing={{ base: 4, lg: 10 }}
				py={10}>
				<PriceWrapper>
					<Box py={4} px={12}>
						<Text fontWeight="500" fontSize="xl">
							Second
						</Text>
						<HStack justifyContent="center">
							<Text fontSize="3xl" fontWeight="900">
								 username
							</Text>
						</HStack>
					</Box>
					<VStack bg={v1} py={4} borderBottomRadius={"xl"}>
						<List spacing={3} textAlign="start" px={12}>
							<ListItem>Cash - $  "xyz"</ListItem>
							<ListItem>Assets - $  "xyz"</ListItem>
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
								King
							</Text>
						</Box>
						<Box py={4} px={12}>
							<Text fontWeight="500" fontSize="3xl">
								First
							</Text>
							<HStack justifyContent="center">
								<Text fontSize="4xl" fontWeight="900">
									 "username"
								</Text>
							</HStack>
						</Box>
						<VStack bg={v4} py={4} borderBottomRadius={"xl"}>
							<List spacing={3} textAlign="start" px={12}>
								<ListItem>Cash - $  "xyz"</ListItem>
								<ListItem>Assets - $  "xy"</ListItem>
							</List>
						</VStack>
					</Box>
				</PriceWrapper>
				<PriceWrapper>
					<Box py={4} px={12}>
						<Text fontWeight="500" fontSize="xl">
							Third
						</Text>
						<HStack justifyContent="center">
							<Text fontSize="3xl" fontWeight="900">
								 "username"
							</Text>
						</HStack>
					</Box>
					<VStack bg={v5} py={4} borderBottomRadius={"xl"}>
						<List spacing={3} textAlign="start" px={12}>
							<ListItem>Cash - $ "xyz"</ListItem>
							<ListItem>Assets - $ "xyz"</ListItem>
						</List>
					</VStack>
				</PriceWrapper>
			</Stack>

		</Box>
	);
};

export default Leaderboard;

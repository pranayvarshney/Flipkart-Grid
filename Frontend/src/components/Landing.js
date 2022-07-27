import {
    Box,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    FormControl,
    FormLabel,
    useBreakpointValue,
    useColorModeValue,
    Icon,
} from '@chakra-ui/react';

import { useNavigate } from "react-router-dom";

export default function Landing() {
    let history = useNavigate();
    const handleSubmit = (e) => {
        let email = document.getElementById('email')
        email = email.value;
        let pass = document.getElementById('password')
        pass = pass.value;
        console.log(email);
        console.log(pass);
        history("/create");
    }
    return (
        <Box position={'relative'} overflow={'hidden'}>
            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>
                    <Heading
                        lineHeight={1.1}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '7xl' }}>
                        NFT Warranty {' '}
                        <Text
                            as={'span'}
                            bgGradient="linear(to-r, blue.400,cyan.400)"
                            bgClip="text">
                            Retail
                        </Text>{' '}
                        Login
                    </Heading>
                </Stack>


                <Stack
                    bg={'gray.50'}
                    rounded={'xl'}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    maxW={{ lg: 'lg' }}>
                    <Stack spacing={4}>
                        <Heading
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                            Welcome
                            <Text
                                as={'span'}
                                bgGradient="linear(to-r, red.400,pink.400)"
                                bgClip="text">
                                !
                            </Text>
                        </Heading>
                        <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                            Contact NFTwarranties team if you don't have a login credentials
                        </Text>
                    </Stack>

                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        bg={useColorModeValue('white', 'gray.700')}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                            Login
                        </Heading>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                placeholder="your-email@example.com"
                                _placeholder={{ color: 'gray.500' }}
                                type="email"
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>
                        <Stack spacing={6}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Stack>


                </Stack>
            </Container>
            <Blur
                position={'absolute'}
                top={20}
                left={30}
                style={{ filter: 'blur(70px)' }}
            />
        </Box>
    );
}

export const Blur = (props) => {
    return (
        <Icon
            width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
            zIndex={useBreakpointValue({ base: -1, md: -1, lg: -1 })}
            height="560px"
            viewBox="0 0 528 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <circle cx="71" cy="61" r="111" fill="#F56565" />
            <circle cx="244" cy="106" r="139" fill="#ED64A6" />
            <circle cy="291" r="139" fill="#ED64A6" />
            <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
            <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
            <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
            <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
        </Icon>
    );
};
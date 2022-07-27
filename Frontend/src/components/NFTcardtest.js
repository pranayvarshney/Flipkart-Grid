import React from 'react'
import {
    Button, Stack, Heading,
    Text,
    HStack,
    Box,
    Image,
} from '@chakra-ui/react'
import { RepeatClockIcon, ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons'
import img from './download.jpg'
import { BiWrench } from 'react-icons/bi';
function NFTcardtest() {
    return (
        <Stack
            pb={10}
            border={'solid 15px white'}
            className='card'
            borderWidth="1px"
            borderRadius="2%"
            minH={"fit-content"}
            justifyContent={'center'}
            alignItems={'center'}
            w={{ sm: "100%", md: "550px", lg: "400px" }}
            height={{ sm: "476px", md: "fit-content", lg: "fit-content" }}
            direction={{ base: "column", md: "column" }}
            position={'relative'}
        >
            <HStack>
                <Heading zIndex={10} p={4} marginRight={5} fontSize={"4xl"} fontWeight={'medium'} fontFamily={"body"}>
                    Product Name
                </Heading>
                <Button size={'lg'}>
                    <DeleteIcon />
                </Button>
            </HStack>

            <Box width={'100%'}  >
                <Image height={'250px'} width={'100%'} src={img} alt='Dan Abramov' />
            </Box>
            <Text textAlign={"center"}
                zIndex={10}
                px={3}>
                lorem20
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur molestiae earum, labore tempore sapiente cumque recusandae fuga numquam magni ratione!
            </Text>
            <Button
                leftIcon={<BiWrench />}
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
                    leftIcon={<ArrowForwardIcon />}
                    colorScheme="green"
                    size="lg"
                >
                    Transfer
                </Button>
                <Button
                    leftIcon={<RepeatClockIcon />}
                    colorScheme="green"
                    size="lg"
                >
                    History
                </Button>
            </HStack>
            <Box className={'vertical'} height={'250px'} zIndex={0} width={'50px'} backdropFilter={"blur(5px)"} background={"rgba(231, 231, 231, 0.348)"} position={'absolute'} bottom={'192px'} right={'-51px'}>
                <Text pt={20} fontSize={'4xl'}>
                    Valid
                </Text>
            </Box>
        </Stack>
    )
}

export default NFTcardtest
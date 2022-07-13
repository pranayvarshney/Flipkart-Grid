import React from 'react'
import { Box, Heading, HStack, Stack, Text, VStack, Input, Button, FormLabel, FormControl, useColorModeValue } from '@chakra-ui/react';
function CreateProduct() {
   const handleSubmit = () => {

   }
   return (
      <HStack>
         <VStack minH={'100vh'}
            //   bg={'#205DA9'}
            bgGradient="linear(to-b, #205DA9,#6697BD)"
            w={'35%'}
            spacing={4}
            paddingTop="40px"
            fontSize={'3xl'}

         >
            <Stack alignItems={'center'} paddingLeft={'30px'} paddingRight={'30px'}>
               <Heading marginBottom={'20px'}>
                  The Future of product warranties
               </Heading>
               <Text as="p" fontSize="lg" >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  condimentum quam arcu, eu tempus tortor molestie at. Vestibulum
                  pretium condimentum dignissim. Vestibulum ultrices vitae nisi sed
                  imperdiet. Mauris quis erat consequat, commodo massa quis, feugiat
                  sapien. Suspendisse placerat vulputate posuere. Curabitur neque
                  tortor, mattis nec lacus non, placerat congue elit.
               </Text>
            </Stack>
         </VStack>
         <Stack
            bg={'gray.700'}
            minH={'100vh'}
            w={'70%'}>
            <Stack
               spacing={20}
               w={'full'}
               maxW={'md'}
               bg={useColorModeValue('white', 'gray.700')}
               p={12}
               my={8}>
               <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl', lg: '5xl' }}>
                  Register
               </Heading>
               <HStack minWidth={'900px'} spacing={20}>
                  <VStack minWidth={"40%"}>
                     <FormControl isRequired id="productName">
                        <FormLabel>Product Name</FormLabel>
                        <Input type="text"
                        />
                     </FormControl>
                     <FormControl isRequired id="productDesc">
                        <FormLabel>Product description</FormLabel>
                        <Input type="text" />
                     </FormControl>
                     <FormControl id="sid" isRequired>
                        <FormLabel>Enter product serial ID</FormLabel>
                        <Input type="text" />
                     </FormControl>
                  </VStack>
                  <VStack minWidth={"40%"}>
                     <FormControl id="pimage" isRequired>
                        <FormLabel>Attach product image</FormLabel>
                        <Input type="file" />
                     </FormControl>
                     <FormControl id="validity" isRequired>
                        <FormLabel>Enter Warranty validity </FormLabel>
                        <Input type="text" />
                     </FormControl>
                     <FormControl id="pageURL">
                        <FormLabel>Enter product page url</FormLabel>
                        <Input type="url" />
                     </FormControl>
                  </VStack>
               </HStack>
              
               
               <Stack spacing={6}>
                  <Button
                     fontSize={'2xl'}
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
      </HStack>
   )
}

export default CreateProduct
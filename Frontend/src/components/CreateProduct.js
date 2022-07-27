import React, { useState } from 'react'
import { Heading, HStack, Stack,Image, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Register from './Register';
import Ticket from './Ticket';
import logo from './logo.png'
import BulkUpload from './BulkUpload';
function CreateProduct() {

   const textObj = ["Received an order? Here you can notify us of your sales. Whenever you receive an order for a product, you can enter the relevant details here to allow your customers to mint the product warranty NFTs after they verify their purchase via the serial number sent to their phones.", "Tired of entering so many order details every time ? Here you can notify us of your sales in bulk of a particular product.You need to upload a CSV file with the serial numbers and the respective phone numbers of the customers who bought that particular product.We already have the basic details about these products so you don’t have to enter it again. Please make sure that the format of the example shown is followed.", "Here you can close any open warranty claims made by your customers. You must provide the serial number of the product whose claim you want to close and you can also add a redressal message to reflect the action taken to address the issues."]
   const [text, settext] = useState(textObj[0]);
   
   return (
      <HStack height={"100%"} alignItems={'center'} overflow={'hidden'} bg={'gray.700'}>
         <Stack height={'100vh'}
            background="linear-gradient(315deg,#B621FE 0%,#1FD1F9 100%)"
            w={'35vw'}
            paddingTop="40px"
            fontSize={'3xl'}
            overflow={'hidden'}
         >
            <Stack alignItems={'center'} paddingLeft={'30px'} paddingRight={'30px'}>
               <Heading fontFamily={'heading'} marginBottom={'20px'} color={'whiteAlpha.900'}>
                  The Future of product warranties
               </Heading>
               <Text as="p" fontSize="xl" height={'fit-content'} pb={10} >
                  {text}
               </Text>
               <Image  height={'200px'} position={'absolute'}  left={'150px'} bottom={'60px'} src={logo} ></Image>
            </Stack>
         </Stack>
         <Stack
            bg={'gray.700'}
            height={'100vh'}
            w={'70%'} pt={5}>
            <Tabs variant='soft-rounded' colorScheme='green' isManual size={'lg'} isFitted onChange={(index) => settext(textObj[index])}>
               <TabList>
                  <Tab>Register</Tab>
                  <Tab>Bulk upload </Tab>
                  <Tab>Warranty Ticket</Tab>
               </TabList>
               <TabPanels>
                  <TabPanel>
                     <Register />
                  </TabPanel>
                  <TabPanel>
                     <BulkUpload />
                  </TabPanel>
                  <TabPanel>
                     <Ticket />
                  </TabPanel>
               </TabPanels>
            </Tabs>

         </Stack>
      </HStack>
   )
}

export default CreateProduct
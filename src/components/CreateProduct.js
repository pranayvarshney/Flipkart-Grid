import React from 'react'
import { Heading, HStack, Stack, Text,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Register from './Register';
import Ticket from './Ticket';
import BulkUpload from './BulkUpload';
function CreateProduct() {
  
   return (
      <HStack height={"100%"} alignItems={'center'} overflow={'hidden'} bg={'gray.700'}>
         <Stack height={'100vh'}
            bgGradient="linear(to-b, #FC466B,#3F5EFB)"
            w={'35vw'}           
            paddingTop="40px"
            fontSize={'3xl'}
            overflow={'hidden'}

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
         </Stack>
         <Stack
            bg={'gray.700'}
            
            height={'100vh'}
            w={'70%'} pt={5}>
            <Tabs variant='soft-rounded' colorScheme='green' isManual size={'lg'} isFitted>
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
                     <BulkUpload/>
                  </TabPanel>
                  <TabPanel>
                     <Ticket/>
                  </TabPanel>
               </TabPanels>
            </Tabs>
         
         </Stack>
      </HStack>
   )
}

export default CreateProduct
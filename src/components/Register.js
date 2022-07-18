import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Heading, HStack, Stack, VStack, Input, Button, FormLabel, FormControl, useColorModeValue,Checkbox, CheckboxGroup} from '@chakra-ui/react';
import ipfs from '../ipfs.js'
function Register() {
    const [productName, setProductName] = useState();
    const [productDesc, setProductDesc] = useState();
    const [sid, setSid] = useState();
    const [validity, setvalidity] = useState();
    const [pageURL, setpageURL] = useState();
    const [path, setPath] = useState();
    const [ipfsHash, setIpfsHash] = useState();
    const [isSBT, setisSBT] = useState(true);
    const handleSubmit = async() => {
        setProductName((document.getElementById("productName")).value)
        setProductDesc((document.getElementById("productDesc")).value)
        setSid((document.getElementById("sid")).value)
        setvalidity((document.getElementById("validity")).value)
        setpageURL((document.getElementById("pageURL")).value)
        
        const files =(document.getElementById("pimage")).files

        const file = files[0];
        const result = await ipfs.add(file);
        setPath(result.path)
        console.log(result)
    }
    useEffect(() => {

        const item = {
            "name": productName,
            "description": productDesc,
            "sid" : sid,
            "validity" : validity,
            "isSoulBound":isSBT,
            "pageURL":pageURL,
            "purchaseDate" : Number(new Date()),
            "image": `http://ipfs.infura.io/ipfs/${path}`
        }
        const createNFT = async () => {
            var buf = Buffer.from(JSON.stringify(item));
            const nft = await ipfs.add(buf)
            setIpfsHash(nft.path)
           
            console.log(nft)
           
        }
        if (path) {

            createNFT();
        }

    }, [path]);
 useEffect(()=>{
    const savetoDB = async()=>{
        try {
            await axios.post('/api/sid', { sid: sid, hash: ipfsHash })
        }
        catch { console.log("err") }
    }
    if(ipfsHash){
        savetoDB();
    }
 },[ipfsHash])

  return (
      <Stack
          spacing={'50px'}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          p={6}
         >
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
          <Checkbox size='lg' colorScheme='green' defaultChecked onChange={(e)=>setisSBT(!isSBT)}>
              Is Soul Bound?
          </Checkbox>
          <Stack spacing={2}>
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
  )
}

export default Register
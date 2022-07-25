import React,{useState} from 'react'
import Papa from "papaparse"
import ipfs from '../ipfs.js'
import axios from 'axios';
import { Stack, Text, Select,Input,Button,useToast } from '@chakra-ui/react';
function BulkUpload() {
    const toast = useToast()
    const [option, setoption] = useState();
    const [ipfsHash, setIpfsHash] = useState();
    const [sidData,setSidData] = useState();
    const optionPicker =(e) =>{
        setoption(e.target.value)
    }
    const changeHandler = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setSidData(results.data)
                console.log(results.data)
            },
        });
    };
    const bulkRegister =async()=>{
        if(option==""){
            window.alert("no option selected")
        }
        else{
            const k = await fetch(`https://ipfs.infura.io/ipfs/${option}`)
            const uri = await k.json()
            const name = await uri.name
            const description = await uri.description
            const validity = await uri.validity
            const pageURL = await uri.pageURL
            const image = (await uri.image)
            const purchaseDate = Number(new Date())
            //traverse thru all SID create hashes and store in db
            sidData.map(async(item)=>{
                var sid = (item.SID)
                const obj = {
                    "name": name,
                    "description": description,
                    "sid": sid,
                    "validity": validity,
                    "pageURL": pageURL,
                    "purchaseDate": purchaseDate,
                    "image": image
                }
                var buf = Buffer.from(JSON.stringify(obj));
                const nft = await ipfs.add(buf)
                // console.log(nft.path)
                try {
                    await axios.post('/api/sid', { sid: sid, hash: nft.path})
                }
                catch { 
                    toast({
                        title: "Error in creation",
                        status: 'error',
                        isClosable: true,
                    })
                    console.log("err") 
                }
                toast({
                    title: "Bulk upload finished",
                    status: 'success',
                    isClosable: true,
                })
            })

        }

    }
  return (
      <Stack height={'70vh'} spacing={10} p={10} justifyContent={'space-between'}>
          <Text fontSize={'4xl'}>
            Choose the product you want to bulk register for
          </Text>
          <Select placeholder='Select Product' width={'fit-content'} onChange={optionPicker}>
              <option value='QmSH7jkVuP45t2NiX1Wjdd61vdnQTyseLwMS5t9MicHMTL'>Iphone 13</option>
              <option value='QmQj2jELwa3w25opygBpkTUzcmh6doqgTJ4qA4U2TW5vDz'>Nike shoes</option>
              <option value='QmXNRigf3q2ECs3wZJHriRiZLV1a67yBuSrnz6B7BjrjAb'>S20 Pro</option>
              <option value='QmQj2jELwa3w25opygBpkTUzcmh6doqgTJ4qA4U2TW5vDz'>Adidas Shoes</option>
              <option value='QmQj2jELwa3w25opygBpkTUzcmh6doqgTJ4qA4U2TW5vDz'>Macbook</option>
          </Select>
          <Input
              width={'fit-content'} 
              size='md'              
              type="file"
              name="file"
              accept=".csv"
              onChange={changeHandler}
                        />
          <Button colorScheme='teal' size='md' width={'fit-content'} onClick={bulkRegister}>
            Register
          </Button>
      </Stack>
  )
}

export default BulkUpload
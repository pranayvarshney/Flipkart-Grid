import React, { useState } from 'react'
import Papa from "papaparse"
import ipfs from '../ipfs.js'
import axios from 'axios';
import csvimage from './carbon.png'
import { Stack, Text, Select, Input, Button, useToast, HStack, Image } from '@chakra-ui/react';
import generateHash from 'random-hash';
function BulkUpload() {
    const toast = useToast()
    const [option, setoption] = useState();
    const [ipfsHash, setIpfsHash] = useState();
    const [sidData, setSidData] = useState();
    const optionPicker = (e) => {
        setoption(e.target.value)
    }
    var flag = 1;
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
    const bulkRegister = async () => {
        if (option == "") {
            window.alert("no option selected")
        }
        else {
            const k = await fetch(`https://ipfs.infura.io/ipfs/${option}`)
            const uri = await k.json()
            const name = await uri.name
            const description = await uri.description
            const validity = await uri.validity
            const pageURL = await uri.pageURL
            const image = (await uri.image)
            const purchaseDate = Number(new Date())
            //traverse thru all SID create hashes and store in db
            sidData.map(async (item) => {
                var sid = (item.SID)
                var phoneNumber = item.PNO
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
                    const OTP = generateHash({ length: 6 });
                    await axios.post('/api/sid', { sid: sid, hash: nft.path, phoneNumber: phoneNumber,OTP : OTP})
                }
                catch {
                    flag = 0;
                    toast({
                        title: "Error in creation",
                        status: 'error',
                        isClosable: true,
                    })
                    console.log("err")
                }
            })
            if (flag != 0) {
                toast({
                    title: "Bulk upload finished",
                    status: 'success',
                    isClosable: true,
                })
            }

        }

    }
    return (
        <HStack>
            <Stack height={'70vh'} spacing={10} p={10} justifyContent={'space-between'}>
                <Text fontSize={'4xl'} lineHeight={1}>
                    Choose the product you want to bulk register for
                </Text>
                <Select placeholder='Select Product' width={'fit-content'} onChange={optionPicker}>
                    <option value='QmRhJ75S4GVChKzCh5vY1vSBX6EGS8jai567hSsz1GoJeH'>Polo Neck T-Shirt</option>
                    <option value='QmWEhyEj6FPjjVy7kvuaAdBQ97b1w3j4iMg6TbZzVh7SGU'>APPLE iPhone 13 Pro</option>
                    <option value='QmcbJHtSGbf6BaXjdyY1cBuDobKKHEd2u1rb8jtFs7wEJY'>Skmei Watch</option>
                    <option value='QmTBp6UZrCSvaWpQ8HDnhAJk6a1mLWxU174BrodH6p3SBW'>Samsung Refrigerator</option>
                    <option value='QmVsyK2moBBQtWRMwooRypWna8UpDNqY4y4JNMtTkyWNSS'>Long Door Curtain</option>
                    <option value='QmU7uUD6TijHbrLZzda9koA3mk99p1X55DzJbMgCpA7x9b'>Realme 9 </option>
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

            <Image height={'400px'} src={csvimage}></Image>
            <Text fontSize={'lg'} position={'absolute'} bottom={'190px'} right={'130px'}>Make sure this exact format is followed</Text>

        </HStack>
    )
}

export default BulkUpload
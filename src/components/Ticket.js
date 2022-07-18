import {  Heading, Stack ,Input,FormControl, FormLabel} from '@chakra-ui/react'
import React from 'react'

function Ticket() {
    return (
        <Stack spacing={20}
            w={'full'}
            maxW={'md'}
            bg={'gray.700'}
            p={6} >
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl', lg: '5xl' }}>
                Ticket
            </Heading>
            <FormControl id="sidTicket" isRequired>
                <FormLabel>Enter product serial ID</FormLabel>
                <Input type="text" />
            </FormControl>
        </Stack>
    )
}

export default Ticket
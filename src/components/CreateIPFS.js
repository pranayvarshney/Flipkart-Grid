import React, { useState ,useEffect} from 'react'
import { Buffer } from 'buffer';
import ipfs from '../ipfs.js'
function CreateIPFS() {
    window.Buffer = Buffer;
    const [ipfsHash, setIpfsHash] = useState({})
    const [product, setProduct] = useState()
    const [description, setDescription] = useState()
    const [path ,setPath] = useState()
    console.log(ipfs)
    const submitImage = async (e) => {
        e.preventDefault()
        const form = e.target;
        const files = form[0].files;
        setProduct(form[1].value)
        setDescription(form[2].value)
        const file = files[0];
        const result = await ipfs.add(file);
        setPath(result.path)
        

    }
    useEffect(() => {

        const item = {
            "name": product,
            "description": description,
            "image": `http://ipfs.infura.io/ipfs/${path}`
        }
        const createNFT = async() =>{
            var buf = Buffer.from(JSON.stringify(item));
            const nft = await ipfs.add(buf)
            setIpfsHash(nft.path)
            console.log(nft)
        }
        if(path){

            createNFT();
        }
        
    }, [path]);
    const captureImage = (e) => {
        e.preventDefault()

    }
    return (
        <div>
            createIPFS

            <form onSubmit={
                submitImage
            }>
                <input type="file" onChange={captureImage} />
                <label htmlFor="product"> Product name</label>
                <input type="text" name="" id="product" aria-label='Product name' />
                <label htmlFor="description">Description</label>
                <input type="text" name="" id="description" aria-label='Description' />
                <input type='submit' />
            </form>


        </div>
    )
}

export default CreateIPFS
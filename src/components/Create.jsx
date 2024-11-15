import React, { useEffect, useState } from 'react'
import { ethers } from "ethers"
import axios from 'axios'
import { toast } from 'react-toastify'
import contractData from '../contract.json'
import pinata from '../key.json'

function Create({ marketplace, account, setMarketplace }) {

  

  const [nftFile, setNFTFile] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [forminfo, setFormInfo] = useState({
    title: "",
    file: "",
    price: 0,
    owner: ""
  });

  useEffect(() => {
    document.title = "Create"
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if(name === "price") {
      if (value <= 0) return
    }
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const changeHandler = (event) => {
    const file = event.target.files[0];
    try {
      console.log("file.type in changehandler: ", file.type);
    } catch (error) {
      console.log(error);
    }
    if (file.type.startsWith('video/')) {
      setNFTFile(file);
    } else {
      alert('Please select a video file.');
      return; // Prevent further processing if not audio/video
    }

  };

  const handleEvent = async (e) => {
    setIsMinting(true)
    e.preventDefault();
    // console.log(nftFile);
    console.log(nftFile);
    console.log(forminfo);

    console.log("uploading nft file");

    const nftFileData = new FormData();
    nftFileData.append('file', nftFile);
    try {

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: nftFileData,
        headers: {
          pinata_api_key: pinata.API_Key,
          pinata_secret_api_key: pinata.API_Secret,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(resFile.data);

      const fileHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
      // let fileType;

      const info = {
        name: forminfo.title,
        file: fileHash,
        price: forminfo.price,
        owner: account
      }

      async function pinJSONToPinata(info) {
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        const headers = {
          'Content-Type': 'application/json',
          'pinata_api_key': pinata.API_Key,
          'pinata_secret_api_key': pinata.API_Secret,
        };

        try {
          const res = await axios.post(url, info, { headers });
          const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
          console.log(meta);
          mintThenList(meta);
        } catch (error) {
          console.error(error);
        }

      }
      pinJSONToPinata(info)


    } catch (error) {
      console.log(error);
    }
    setIsMinting(false)
  };


  const mintThenList = async (uri) => {
    // if (marketplace === null) {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // await provider.send("eth_requestAccounts", []);
      // const signer = provider.getSigner();
      // let marketplaceAddress = contractData.address;
      // const marketplacecontract = new ethers.Contract(
      //   marketplaceAddress,
      //   contractData.abi,
      //   signer
      // );
      console.log(marketplace);
      // setMarketplace(marketplacecontract);
    
    
    // const functionName = "addFile";
    // const functionParams = [uri];
    const listingPrice = ethers.utils.parseEther(forminfo.price.toString())
    
    toast.info("Confirm to Mint the NFT", {
      position: "top-center"
    })
    try {
      console.log("inside try");
      console.log(Number(listingPrice));
      const tx1 = (await marketplace.addFile(uri, listingPrice))

      toast.info("Wait till transaction Confirms....", {
        position: "top-center"
      })

      await tx1.wait()
      toast.success("NFT added to marketplace successfully", { position: "top-center" })
    } catch (error) {
      toast.error("Error adding NFT to Marketplace")
      console.log(error);
    }

  }



  return (
    <div className='h-screen pt-24'>
      <div className="container-fluid mt-5 text-left">
        <div className="content mx-auto">

          <form class="max-w-sm mx-auto">
            <div className='max-w-lg mx-auto'>
              <label class="block mb-2 text-sm font-medium text-white" for="nftfile">Upload NFT File</label>
              <input onChange={changeHandler} name="nftfile" class="block w-full mb-4 h-8 text-m  text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" accept="video/*" />
            </div>


            <div class="mb-4">
              <label for="title" class="block mb-2 text-sm font-medium text-white">NFT Name</label>
              <input onChange={handleChange} type="text" id="title" name='title' class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter NFT name" required />
            </div>

            <div class="mb-4">
              <label for="price" class="block mb-2 text-sm font-medium text-white">NFT Price</label>
              <input onChange={handleChange} type="number" id="price" name='price' value = {forminfo.price} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="0.0001 ETH" />
            </div>
            
            <div className='text-center'>
              <button onClick={handleEvent} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" disabled={isMinting}>
                {isMinting ? "Minting..." : "Mint NFT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Create
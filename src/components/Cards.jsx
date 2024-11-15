import React, { useEffect, useState } from 'react'
import Fluid from "../assets/Fluid.png"
import Flower from "../assets/Flower.png"
import Ethereum from "../assets/Ethereum.svg"
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import '../App.css';

import { toast } from 'react-toastify'
import contractData from '../contract.json'


function Cards({ item, currNft, player, setPlayer, setCurrNft, account, idx, processing, setProcessing, marketplace }) {

  console.log(processing);
  
  async function handlePayment(item) {
    setProcessing(true)
    try {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // await provider.send("eth_requestAccounts", []);
      // const signer = provider.getSigner();
      // let marketplaceAddress = contractData.address;
      // const marketplacecontract = new ethers.Contract(
      //   marketplaceAddress,
      //   contractData.abi,
      //   signer
      // );
      const marketplacecontract = marketplace
      console.log(marketplacecontract);   
      
      const price = ethers.utils.parseEther((item.price).toString());
      console.log("price to pay: " + price);
      const tx = await marketplacecontract.watchVideo(idx, {
        value: (price) // Assuming you have apartment price
      });      // Send the transaction (assuming signer has sufficient funds)
      const receipt = await tx.wait();

      await tx.wait();
      toast.success("Transaction successful!", { position: "top-center" })
      console.log("Transaction successful:", receipt);
      setPlayer(true);
      setCurrNft(item)
      console.log(receipt.transactionHash);

    } catch (error) {
      console.log(error);

    }
    setProcessing(false)
  }

  return (
    <div className='card-div'>
      <div className='card-inner p-2'>
        {/* <img src={item.image} alt="" className='object-cover w-[230px] h-[230px] rounded overflow-hidden' /> */}
        <video
            className="card-img-top"
            alt="NFT"
            src={item.file}
            controls={false}
            autoPlay={false}
            style={{ height: "auto", width: "230px" }}
          >
          </video>
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-white text-2xl font-thin mt-3'>{item.name}</h3>
          <h4 className='text-white text-2xl font-thin mt-3'>Price: <span className='text-green-400'><strong>{item.price} </strong></span> ETH</h4>
          <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
            {!player &&
              <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 " disabled={processing} onClick={() => { handlePayment(item) }}>Watch Video</button>
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cards
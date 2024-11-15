import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import PlayerCard from './PlayerCard';
import contractData from '../contract.json'
import { ethers } from 'ethers';


// import { toast } from 'react-toastify';

function NFTs({ marketplace, setMarketplace, account, setNFTitem }) {

  // useEffect(() => {
  //   // Check if the page load was caused by a refresh (F5 or browser refresh)
  //   if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  //     // Redirect to the home page
  //     window.location.href = "/";
  //   }
  // }, []);

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [processing, setProcessing] = useState(false)

  const loadMarketplaceItems = async () => {
    // console.log("contract in nfts", marketplace);
    setLoading(true)
    if (marketplace === null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let marketplaceAddress = contractData.address;
      const marketplacecontract = new ethers.Contract(
        marketplaceAddress,
        contractData.abi,
        signer
      );
      console.log(marketplace);
      setMarketplace(marketplacecontract);
    }
    const itemCount = Number(await marketplace.fileCount.call())
    console.log("count: " + itemCount);

    // console.log("item count", itemCount);

    let displayItems = [];
    let items = await marketplace.viewFiles();

    // console.log("items: ", items);
    // console.log(itemCount);
    for (let i = 0; i < itemCount; i++) {
      const item = items[i]
      // console.log("item: ", item);
      console.log(item);
      const uri = await item.ipfsHash

      const response = await fetch(uri)
      const metadata = await response.json()
      displayItems.push(metadata)

    }
    setLoading(false)
    setItems(displayItems)
    // console.log("type: ", typeof (items));
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  let [currNft, setCurrNft] = useState(null);
  let [player, setPlayer] = useState(false);

  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
      </main>
    )
  }

  return (
    <>
      <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>
        {player && (
          // <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>

          // </div>
          <div style={{
            width: '650px',
            height: 'auto',
            // backgroundColor: "#ddd",
            margin: '0 auto',
            display: 'block',
            // justifyContent:'center'
          }}>
            {/* <PlayerCard item={currNft} player={player}/> */}
            <div className='audio-outer'>
              <div className='audio-inner'>
                <PlayerCard item={currNft} player={player} setPlayer={setPlayer} setCurrNft={setCurrNft} currNft={currNft} />
              </div>
            </div>
          </div>
        )}
        {
          (items.length > 0 ?
            items.map((item, idx) => (
              <Cards item={item} currNft={currNft} player={player} setPlayer={setPlayer} setCurrNft={setCurrNft} account={account} idx={idx} processing={processing} setProcessing={setProcessing} />
            ))

            : (
              <main style={{ padding: "1rem 0" }}>
                <h2 className='text-white'>No listed assets</h2>
              </main>
            ))}
      </div>
    </>
  )
}

export default NFTs
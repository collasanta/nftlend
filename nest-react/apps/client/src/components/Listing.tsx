import { useEffect, useState } from "react"
import { ListingCard } from "./ListingCard";
interface NFT {
  tokenId: number;
  metadata: IMetadata;
}

export interface IMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  background_color: string;
  customImage: string;
  customAnimationUrl: string;
}


export const Listing = () => {
  const [listings, setListings] = useState<NFT[]>([]);
  const nftContractAddress = "0x4F1bbb87Fa6C34D695D4F4d9Ef4CCB102A385588"
  useEffect(() => {
    async function run() {
      const getResponse = await fetch(`api/users/nfts/${nftContractAddress}`)
      if (getResponse.ok) {
        const nfts = await getResponse.json();
        console.log('nfts', nfts);
        setListings(nfts);
      }
    }

    run(); // Call the function
  }, []);



  return (
    <div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 border-2 border-black mx-auto mt-[75px] max-w-[800px]">
        <div className="font-bold text-black text-[24px] mx-auto text-center">
          Listings
        </div>
        {!listings && "Loading..."}
        {listings && listings!.map((listing: NFT) => (
          <ListingCard
            key={listing.tokenId}
            metadata={listing.metadata}
          />
        ))}
      </div>
    </div>
  )
}

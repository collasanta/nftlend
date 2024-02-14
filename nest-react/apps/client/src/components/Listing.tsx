import { ListingCard } from "./ListingCard";
import { useQuery } from "@metamask/sdk-react-ui";
import Spinner from "./Spinner";

export interface INFT {
  tokenId: number;
  metadata: IMetadata;
  imgURL: string,
  contractAddress: string;
  chain: string;
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
  const nftContractAddress = "0x4F1bbb87Fa6C34D695D4F4d9Ef4CCB102A385588"

  async function fetchNfts() {
    const getResponse = await fetch(`api/users/nfts/${nftContractAddress}`);
    if (!getResponse.ok) {
      throw new Error('Error fetching data');
    }
    return await getResponse.json();
  }

  const { data: listings } = useQuery<INFT[]>(['nfts'], fetchNfts);

  return (
    <div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 bg-gray-200 rounded-lg mx-auto mt-[75px] pb-[25px] max-w-[800px]">
        <div className="font-bold text-black text-[24px] mx-auto text-center">
          Listings
        </div>
        {listings ? listings!.map((listing: INFT) => (
          <ListingCard
            key={listing.tokenId}
            listing={listing}
          />
        ))
          :
          <div className="font-bold text-slate-300 text-[20px] mx-auto text-center">
            Loading SmartContract Data...
            <Spinner />
          </div>
        }
      </div>
    </div>
  )
}

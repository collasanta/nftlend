import { useQuery } from 'react-query';
import { ListingCard } from './ListingCard';
import Spinner from './Spinner';

export type ILoan = {
  loanId: number;
  initialOwner: string;
  nftContractAddress: string;
  tokenId: string;
  principal: string;
  duration: string;
  interest: string;
  lender: string;
  startDate: string;
  loanStatus: string;
  chain: string;
  imgURL: string;
  name: string;
};

export const Listing = () => {
  const fetchListings = async (): Promise<ILoan[]> => {
    const res = await fetch(`api/users/loans`);
    if (!res.ok) {
      throw new Error('Error fetching listings');
    }
    return res.json();
  };

  const { data: listings, error, isLoading } = useQuery<ILoan[]>('nfts', fetchListings);

  return (
    <div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 mt-10">
        <div className='pb-10 bg-[#f2f2f2] max-w-[700px] mx-auto rounded-lg'>
          <div className='text-center text-[30px] py-3'>
            {isLoading && <div><Spinner/></div>}
            {(error as Error) && <div>Error Loading Listings</div>}
            {listings && listings.length > 0 && <div>Loans Listings</div>}
          </div>
          <div className='space-y-4'>
          {listings && listings.map((listing: ILoan) => (
            <ListingCard
              key={listing.loanId}
              listing={listing}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
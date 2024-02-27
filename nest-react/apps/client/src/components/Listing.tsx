import { useQuery } from 'react-query';
import { ListingCard } from './ListingCard';
import Spinner from './Spinner';
import { LoanStatus } from '@/lib/utils';
import { useState } from 'react';
import { FilterIcon } from 'lucide-react';

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
  const [filtered, setFiltered] = useState<ILoan[]>([]);

  const fetchListings = async (): Promise<ILoan[]> => {
    const res = await fetch(`api/users/loans`);
    if (!res.ok) {
      throw new Error('Error fetching listings');
    }
    return res.json();
  };

  const { data: listings, error, isLoading } = useQuery<ILoan[]>('nfts', fetchListings);

  const filterListings = (status: LoanStatus | null) => {
    if (listings) {
      setFiltered(listings.filter(listing => listing.loanStatus === status));
    }
  };

  return (
    <div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 mt-5">
        <div className='pb-10 bg-[#f2f2f2] max-w-[700px] mx-auto rounded-lg'>
          <div className='text-center text-[30px] py-3'>
            {(error as Error) && <div>Error Loading Listings</div>}
          </div>
          <div>
            <div className='font-bold max-w-[600px] min-h-[50px] mb-2 mx-auto flex items-center justify-around'>
             <FilterIcon onClick={() => filterListings(null)} size={20} className='shadow-mdtext-zinc-600 min-w-[50px] max-w-[50px]' />
              <button onClick={() => filterListings(LoanStatus.Available)} className="min-w-[50px] max-w-[50px] shadow-md text-[13px] bg-card p-2 rounded-lg text-zinc-600">
                {'🟢'} 
              </button>
              <button onClick={() => filterListings(LoanStatus.Active)} className="shadow-md text-[13px] min-w-[50px] max-w-[50px] bg-card p-2 rounded-lg text-zinc-600">
                {'🟡'}
              </button>
              <button onClick={() => filterListings(LoanStatus.Repaid)} className="shadow-md text-[13px] min-w-[50px] max-w-[50px] bg-card p-2 rounded-lg text-zinc-600">
                {'🔵'}
              </button>
              <button onClick={() => filterListings(LoanStatus.Defaulted)} className="shadow-md text-[13px] min-w-[50px] max-w-[50px] bg-card p-2 rounded-lg text-zinc-600">
                {'🔴'}
              </button>
            </div>
          </div>
          {isLoading && <div><Spinner /></div>}
          <div className='space-y-4'>
            {filtered.length > 0 ? 
            filtered && filtered.map((filtered: ILoan) => (
              <ListingCard
                key={filtered.loanId}
                listing={filtered}
              />
            ))
            : 
            listings && listings.map((listing: ILoan) => (
              <ListingCard
                key={listing.loanId}
                listing={listing}
              />
            )) }
            {}
          </div>
        </div>
      </div>
    </div>
  );
};
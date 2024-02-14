import { useState } from "react"
import { INFT } from "./Listing";


export const ListingCard = (
  { listing, collapsed = false }: { listing: INFT, collapsed?: boolean }
) => {
  console.log(listing.metadata.image)
  const [isOpen, setIsOpen] = useState(collapsed);

  function handleClick() {
    setIsOpen(!isOpen);
    console.log(isOpen)
  }

  return (
    <div className="flex flex-col mx-auto border max-w-[600px] bg-slate-300 border-black/5 text-card-foreground shadow-sm rounded-lg text-[13px]  py-2 px-2 hover:shadow-lg transition cursor-pointer">
      <div onClick={handleClick} className="    flex items-center justify-between ">
        <div className="flex items-center gap-x-2 truncate">
          <div className="w-fit bg-emerald-500/10 rounded-full">
            <img src={listing.imgURL} width={112} height={64} alt="thumbnail" className="rounded-md" />
          </div>
        </div>
        <div>
        <p className="font-semibold text-sm pr-2 text-center whitespace-break-spaces">
          {listing.metadata.name}
        </p>
        <p className="text-[10px] pr-2 text-center whitespace-break-spaces">
          Contract Address: {listing.contractAddress}
        </p>
        <p className="text-[10px] pr-2 text-center whitespace-break-spaces">
          Chain: {listing.chain}
        </p>
        </div>
      </div>
    </div>
  )
}
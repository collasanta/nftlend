import { useState } from "react"
import { IMetadata } from "./Listing";


export const ListingCard = (
  { metadata, collapsed = false }: { metadata: IMetadata, collapsed?: boolean }
) => {

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
            <img src={metadata.image} width={112} height={64} alt="thumbnail" className="rounded-md" />
          </div>
        </div>
        <p className="font-semibold text-sm pr-2 text-center whitespace-break-spaces">
          {metadata.name}
        </p>
      </div>
    </div>
  )
}
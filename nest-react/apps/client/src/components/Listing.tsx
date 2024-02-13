import { useEffect, useState } from "react"
import { ListingCard } from "./ListingCard";

export const Listing = () => {
  const [listings, setListings] = useState([])

  interface IYoutubeVideoInfo {
    languages: string | null;
    videoLenghtSeconds: number;
    videoLengthMinutes: number;
    videoLenghtFormatted: string;
    videoTitle: string;
    videoChannelName: string;
    videoThumb: string;
    videoId: string;
    generationId: string;
  }

  interface IChapterList {
    videoInfos: IYoutubeVideoInfo;
  }

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then(setListings)
  }, [])

  return (
    <div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {/* <ChapterCard genId="asdasds" /> */}
        {listings.map((listing: IChapterList) => (
          <ListingCard
            key={listing.videoInfos.generationId}
            chapter={listing}
          />
        ))}
      </div>
    </div>
  )
}

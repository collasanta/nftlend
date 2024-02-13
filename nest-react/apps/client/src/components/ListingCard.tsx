import { ArrowDown, Key, Pointer } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export interface IYoutubeVideoInfo {
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

export const ListingCard = (
  { chapter, collapsed = false }: { chapter: IChapterList, collapsed?: boolean }
) => {

  const [isOpen, setIsOpen] = useState(collapsed);

  function handleClick() {
    setIsOpen(!isOpen);
    console.log(isOpen)
  }

  return (
    <div className="flex flex-col border max-w-[750px] bg-secondary border-black/5 text-card-foreground shadow-sm rounded-lg text-[13px]  py-2 px-2 hover:shadow-lg transition cursor-pointer">
      <div onClick={handleClick} className="    flex items-center justify-between ">
        <div className="flex items-center gap-x-2 truncate">
          <div className="w-fit bg-emerald-500/10 rounded-full">
            <img src={chapter.videoInfos.videoThumb} width={112} height={64} alt="thumbnail" className="rounded-md" />
          </div>
        </div>
        <p className="font-semibold text-sm pr-2 text-center whitespace-break-spaces">
          {chapter.videoInfos.videoTitle.length > 50 ? chapter.videoInfos.videoTitle.substring(0, 50) + "..." : chapter.videoInfos.videoTitle}
        </p>
        <div>
          {
            isOpen ? <ArrowDown className="w-5 h-5 transform rotate-180" /> : <ArrowDown className="w-5 h-5" />
          }
        </div>
      </div>
      {isOpen && (
        <>
          <div className="mt-6 flex justify-center border bg-card  border-black/5 rounded-lg p-2">
            <Tabs defaultValue="chapters" className="w-full text-center mb-4 md:px-6">
              <TabsList className="mb-2">
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="description">Review</TabsTrigger>
              </TabsList>
              <TabsContent value="chapters">
                <div className="space-x-1 align-baseline mb-3">
                  <Pointer className="w-4 h-4 inline-block" color="#a8a3a3" />
                  <a className="text-zinc-400 italic align-bottom">click to copy</a>
                </div>
                <div id="Chapters" className="flex flex-col justify-start pl-3 space-y-2">
                  INFO 1
                  INFO 2
                  INFO 3
                </div>
              </TabsContent>
              <TabsContent value="description">
                <div className="space-x-1 align-baseline mb-3">
                  <a className="text-zinc-400 italic align-bottom">click to copy</a>
                </div>
                <div id="Review" className="px-1">
                  TEST
                  <div className="space-x-1 mt-2 align-baseline mb-2">
                    <br></br>
                    <Key className="w-5 h-5 inline-block" color="#a8a3a3" />
                    <a className="text-zinc-400 italic align-bottom">Keywords</a>
                  </div>
                  <div className="px-1">
                    TESTE
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}
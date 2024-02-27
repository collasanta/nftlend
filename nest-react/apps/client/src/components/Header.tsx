import { ConnectButton } from './ConnectButton'

export const Header = () => {
  return (
    <div className='bg-slate-200 shadow-lg'>
      <div className='flex flex-row items-center space-y-4 sm:space-y-0 justify-between max-w-[1050px] px-4 mx-auto py-2 sm:py-5'>
        <span className='font-bold  rounded-lg p-3 items-center mt-4 sm:mt-0 text-[12px] sm:text-[25px]'>💰 NFTLend 🖼️</span>
        <ConnectButton />
        {/* <SignButton />
        <InstallSnapButton /> */}
      </div>
    </div>
  )
}

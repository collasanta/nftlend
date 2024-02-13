import { ConnectButton } from './ConnectButton'
import { InstallSnapButton } from './InstallSnapButton'
import { SignButton } from './SignButton'

export const Header = () => {
  return (
    <div className='flex justify-between max-w-[750px] mx-auto pt-[100px]'>
    <ConnectButton />
    <SignButton />
    <InstallSnapButton />
  </div>
  )
}

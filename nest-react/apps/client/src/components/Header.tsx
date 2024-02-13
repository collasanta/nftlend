import { Button } from './ui/button'

export const Header = () => {
  return (
    <div className='flex justify-between max-w-[750px] mx-auto'>
    <Button>
      Borrow
    </Button>
    <Button>
      Connect Wallet 
    </Button>
  </div>
  )
}

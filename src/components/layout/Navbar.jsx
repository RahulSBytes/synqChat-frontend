import { Bell, LogOut, Plus, Settings, UserPlus, Users } from 'lucide-react'

function Navbar() {
  return (
    <nav className="flex flex-col items-center justify-end  bg-[#3B3B3B] w-[5rem]">
      <div className='flex flex-col flex-1 justify-center gap-10'>
        <span className='flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer'><Plus size={22} strokeWidth={2.5}/></span>
        <span className='flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer'> <Users size={22} strokeWidth={2.5}/></span>
        <div className="indicator relative flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer">
          <Bell className='' size={22} strokeWidth={2.5}/>
          <span className="badge badge-xs badge-primary bg-[#248F60] indicator-item  absolute top-1 right-1">10</span>
        </div>
        <span className='flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer'><LogOut size={22} strokeWidth={2.5} /></span>
      </div>

      <div className='flex flex-col justify-center gap-3  h-40 items-center'>
        <span className='flex justify-center items-center p-1 rounded-md hover:bg-[#313131] hover:rotate-90 cursor-pointer'><Settings strokeWidth={2.5} /></span>

        <span className='w-full h-[0.7px] bg-zinc-300' />
        <img src="/image.png" className='h-6 mt-1 rounded-sm w-6 hover:scale-[1.08]' />
      </div>
    </nav>
  )
}

export default Navbar
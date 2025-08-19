import { Dot, Search } from 'lucide-react'
import { userdata } from './constants/userdata'

function UsersList() {
  return (
    <aside className="w-80 hidden md:flex flex-col bg-[#242424] pt-6">
      <div className='flex m-auto mb-6 gap-1'>
       <img src="/logo.png" className='h-8' /><span className='font-semibold'>SyncChat</span> 
      </div>
      <div className="flex w-3/4 bg-[#3B3B3B] m-auto rounded-full px-3 py-[3px]">
        <input
          type="text"
          placeholder="search user"
          className="w-full bg-transparent outline-none text-sm pb-[2px]"
        />
        <Search size={18} strokeWidth={2} />
      </div>


      <div className="flex-1 flex flex-col gap-2 my-4 px-2 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
        {userdata.map(({ dp, name, lastMessage, time, id }) => (
          <div className="flex items-center hover:bg-[#313131]" key={id}>
            <div className='relative'>
              <img src={dp || '/image.png'}
                className="h-8 w-8 rounded-full mx-2" />
              <Dot className='absolute right-5 bottom-3' size={30} strokeWidth={3} color='#5dbb63'/>
            </div>
            <div className="flex flex-col flex-1 self-baseline">
              <span className='flex items-center'>{name}</span>
              <span className="text-xs text-zinc-300">{lastMessage}</span>
            </div>
            <div className="flex flex-col items-end gap-2 mr-3 py-1">
              <span className="text-xs text-zinc-300">{time}</span>
              <span className="w-4 h-4 text-xs flex justify-center items-center bg-[#248f60] rounded-full font-medium">
                3
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default UsersList

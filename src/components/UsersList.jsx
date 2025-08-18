import { Search } from 'lucide-react'
import { userdata } from './constants/userdata'

function UsersList() {
  return (
    <aside className="w-80 hidden md:flex flex-col bg-[#242424] ">
      <div className="flex w-3/4 bg-[#3B3B3B] m-auto rounded-full px-3 py-[5px]">
        <input
          type="text"
          placeholder="search user"
          className="w-full bg-transparent outline-none text-sm pb-[2px]"
        />
        <Search size={18} strokeWidth={2} />
      </div>


      <div className="flex-1 flex flex-col gap-2 my-4 px-2 overflow-y-scroll">
        {userdata.map(({ dp, name, lastMessage, time, id }) => (
          <div className="flex items-center" key={id}>
            <img
              src={dp || '/image.png'}
              className="h-8 w-8 rounded-full mx-2"
            />
            <div className="flex flex-col flex-1 self-baseline">
              <span>{name}</span>
              <span className="text-xs text-zinc-300">{lastMessage}</span>
            </div>
            <div className="flex flex-col items-end gap-2 mr-3 py-1">
              <span className="text-xs text-zinc-300">{time}</span>
              <span className="w-4 h-4 text-xs flex justify-center items-center bg-[#248f60] rounded-full">
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

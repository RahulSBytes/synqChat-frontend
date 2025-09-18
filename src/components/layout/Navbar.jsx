import { Bell, LogOut, Plus, Settings, UserRoundSearch, Users } from 'lucide-react'
import { useUIStore } from '../../store/store.js'
import '../../index.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from "../../constants/config.js"


function Navbar() {

  const navigate = useNavigate()

  async function logoutHandler(){
      const { data } = await axios.post( 
    `${server}/api/v1/auth/logout`,
    {}, 
    { withCredentials: true }  // axios config 
  ); 

  navigate('/auth/login')

  }

  const {isGroupIconClicked, setIsGroupIconClicked, setIsNewGroupClicked, setIsSearchPeopleClicked, setIsNotificationClicked } = useUIStore();

  return (
    <nav className="hidden md:flex flex-col items-center justify-end  bg-[#3B3B3B] w-16">
      <div className='flex flex-col flex-1 justify-center gap-8'>
        <span onClick={setIsSearchPeopleClicked} data-tip="find user" className='tooltip-sm tooltip tooltip-right flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer'><UserRoundSearch size={22} strokeWidth={2.5} /></span>

        <span onClick={setIsNewGroupClicked} data-tip="new group" className='tooltip-sm tooltip tooltip-right flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer'><Plus size={22} strokeWidth={2.5} /></span>
        <span onClick={setIsGroupIconClicked} data-tip="groups" className={`tooltip-sm tooltip tooltip-right flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer ${isGroupIconClicked && 'bg-[#515151]'}`}> <Users size={22} strokeWidth={2.5} /></span>
        <div onClick={setIsNotificationClicked} data-tip="notifications" className="tooltip-sm tooltip tooltip-right indicator relative flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer">
          <Bell size={22} strokeWidth={2.5} />

          <span className="badge badge-xs badge-primary bg-[#248F60] indicator-item  absolute top-1 right-1">10</span>
        </div>
        <span onClick={logoutHandler} data-tip="logout" className='tooltip-sm tooltip tooltip-right flex justify-center items-center p-2 rounded-md hover:bg-[#313131] cursor-pointer'><LogOut size={22} strokeWidth={2.5} /></span>
      </div>

      <div className='flex flex-col justify-center gap-3  h-40 items-center'>
        <span onClick={()=>navigate('/settings')} className='flex justify-center items-center p-1 rounded-md hover:bg-[#313131] hover:rotate-90 cursor-pointer'><Settings strokeWidth={2} /></span>

        <span className='w-full h-[0.7px] bg-zinc-300' />
        <img src="/image.png" className='h-7 mt-1 rounded-sm w-7 hover:scale-[1.08]' />
      </div>
    </nav>
  )
}

export default Navbar
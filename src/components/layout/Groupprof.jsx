import { Dot } from "lucide-react"
import { useNavigate } from 'react-router-dom'


function Groupprof({ name, lastMessage = '', noOfUnseenMsg = 0, id, time = '', isGroupChat = false, dp = '' }) {

    const nevigate = useNavigate();


    return (
        <div onClick={() => nevigate(`/chat/${id}`)} className="flex gap-2 items-center p-2 pl-2 justify-between hover:bg-[#323232]">
            <div className="flex gap-2 flex-1 items-center ">

                {!isGroupChat ?

                    <div className='relative'>
                        <img src={dp || '/image.png'}
                            className="h-8 w-8 rounded-full" />
                        <Dot className='absolute right-4 bottom-3' size={30} strokeWidth={3} color='#5dbb63' />
                    </div>
                    :
                    <div className="flex-col p-2 w-8 h-8 gap-1 flex bg-zinc-500 rounded-full justify-center items-center">
                        <div className="flex gap-1">
                            <div className=" h-[6px] w-[6px] bg-zinc-800"></div>
                            <div className=" h-[6px] w-[6px] bg-zinc-800"></div>
                        </div>
                        <div className="flex gap-1">
                            <div className=" h-[6px] w-[6px] bg-zinc-800"></div>
                            <div className=" h-[6px] w-[6px] bg-zinc-800"></div>
                        </div>
                    </div>

                }
                <div className=" flex-1 items-center">
                    <span className="line-clamp-1">{name}</span>
                    <span className="text-xs text-zinc-300 line-clamp-1">{lastMessage}</span>

                </div>
            </div>
            <div className="flex flex-col items-end gap-2 mr-3 py-1 h-full">
                <span className="text-xs text-zinc-300">{time}</span>

                {
                    noOfUnseenMsg > 0 && <span className="w-4 h-4 text-xs flex justify-center items-center bg-[#248f60] rounded-full font-medium">
                        {noOfUnseenMsg <= 20 ? noOfUnseenMsg : '20+'}
                    </span>
                }
            </div>
        </div>
    )
}

export default Groupprof
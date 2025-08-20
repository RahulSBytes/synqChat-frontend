import { ArrowUpRight, Clapperboard, Dot, FileAudio, FileMinus, Image } from 'lucide-react'

function Details() {
    return (
        <aside className=" hidden lg:flex w-80 bg-[#242424]  flex-col px-6 py-8">
            <div className=' w-full flex flex-col items-center gap-1'>
                <img src="/image.png" className='h-14 rounded-full' />
                <h4 className='font-semibold text-lg'>Jhon Doe</h4>
                <p className='text-center text-sm'>example@gmail.com</p>
                <p className='px-1 text-center text-zinc-300 text-xs'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, incidunt!</p>
            </div>
            <div className=" flex flex-col mt-10 gap-6">
                <h4 >Members [12]</h4>
                <div className="flex w-4/6">
                    <div className='relative'>
                        <img src={'/image.png'}
                            className="h-7 w-7 rounded-full mx-2" />
                        <Dot className='absolute right-5 bottom-3' size={30} strokeWidth={3} color='#5dbb63' />
                    </div>
                    <div className="flex">
                        <span className='flex items-center text-sm font-semibold'>Jimmi Doe</span>
                    </div>
                </div>
                <div  >
                    <h4 className='pb-1'>Files</h4>
                    <div className='flex flex-col gap-1'>
                        <span className='flex justify-between hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                            <span className='flex gap-1 text-sm'><FileMinus  /> Document</span>
                            <ArrowUpRight size={16}  color='#5dbb63'/>
                        </span>
                        <span className='flex justify-between hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                            <span className='flex gap-1 text-sm'><Image /> Images</span>
                            <ArrowUpRight size={16}  color='#5dbb63'/>
                        </span>
                        <span className='flex justify-between hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                            <span className='flex gap-1 text-sm'><Clapperboard /> Videos</span>
                            <ArrowUpRight size={16} color='#5dbb63' />
                        </span>
                        <span className='flex justify-between hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                            <span className='flex gap-1 text-sm'><FileAudio /> Audios</span>
                            <ArrowUpRight size={16} color='#5dbb63' />
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Details
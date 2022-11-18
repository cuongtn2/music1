import React from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { actionType } from '../../context/reducer'
import { useStateValue } from '../../context/StateProvider'

function PlayCard({ data, index}) {

    const [{ songIndex, isSongPlaying }, dispath] = useStateValue()

    const addToContext = () => {
        if (!isSongPlaying) {
            dispath({
                type : actionType.SET_ISSONG_PLAYING,
                isSongPlaying : true,
            })
        }

        if (songIndex !== index) {
            dispath({
                type : actionType.SET_SONG_INDEX,
                songIndex : index,
            })
        }
    }

    return ( 
        <div 
            className='bg-gray-600 p-4 rounded-md flex-1 hover:bg-slate-200 group:'
            onClick={addToContext}
            >
            <div>
                <div className='pt-[100%] mb-4 relative'>
                    <img src={data.imageURL} alt='song' className='absolute inset-0 object-cover w-full h-full' />
                    {/* button còn thiếu  */}
                    <button className='w-10 h-10 rounded-full bg-red-500 absolute bottom-2 right-2 flex items-center justify-center group-hover:flex'>
                        <BsFillPlayFill/>
                    </button>
                </div>
                <div>
                    <h5 className='truncate text-base font-bold font-sans'> {data.name.length > 25 ? `${data.name.slice(0,25)}..` : data.name}</h5>
                    <p className='overflow-hidden text-ellipsis whitespace-normal text-lime-100 text-sm font-medium font-sans mt-1'>
                        {data.artist && (<>{data.artist.length > 25 ? `${data.artist.slice(0,25)}....` : data.artist}</>
                        )}
                    </p>
                </div>
            </div>
        </div>
     );
}

export default PlayCard;
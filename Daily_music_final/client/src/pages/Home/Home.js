import React, { useEffect } from 'react'
import { getAllSongs } from '../../api';
import { ButtonUser, Search, Sidebar } from '../../components';
import { actionType } from '../../context/reducer';
import { useStateValue } from '../../context/StateProvider';
import HomeContainer from './HomeContainer';

function Home() {

    const [{
        allSongs,
    },dispath
    ] = useStateValue()

    useEffect(() => {
        if (!allSongs) {
            getAllSongs().then((data) => {
                dispath({
                    type : actionType.SET_ALL_SONGS,
                    allSongs : data.songs,
                })
            })
        }
    }, [])

    return (
        <div className='flex'>
            <Sidebar/>
             <div className="p-5 text-2xl font-semibold flex-1 h-screen">

                {/* header */}
                <div className=" w-full p-4 md:py-2 md:px-3 flex items-center">
                    <Search/>
                    <ButtonUser/>
                </div>
                <h2 className='font-mono text-center text-3xl text-fuchsia-700'>Home Music</h2>

                <div className='grid gap-y-6 pt-6'>
                    <HomeContainer data={allSongs} />
                </div>
             </div>
        </div>
    );
}

export default Home;
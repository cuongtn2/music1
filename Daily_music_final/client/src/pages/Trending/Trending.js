import React from 'react'
import { ButtonUser, Search, Sidebar } from '../../components';

function Trending() {
    return ( 
        <div className='flex'>
            <Sidebar/>
            <div className="p-5 text-2xl font-semibold flex-1 h-screen">
                
                {/* header */}
                    <div className=" w-full p-4 md:py-2 md:px-3 flex items-center">
                        <Search/>
                        <ButtonUser/>
                    </div>
                    Trending page
                </div>
        </div>
     );
}

export default Trending;
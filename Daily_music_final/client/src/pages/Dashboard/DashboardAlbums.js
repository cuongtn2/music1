import React, { useEffect } from "react";
import { getAllAlbums } from "../../api";
import AlbumContainer from "../../components/Container/AlbumContainer";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";

function DashboardAlbums() {

    const [{ allAlbums }, dispath] = useStateValue()

    useEffect(() => {
        if (!allAlbums) {
            getAllAlbums().then((data) => {
                dispath({
                    type : actionType.SET_ALL_ALBUMS,
                    allAlbums : data.album,
                })
            })
        }
    }, [])

    return ( 
        <div className="w-full p-4 flex items-center justify-center flex-col">
            <div className="relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md ">
                <AlbumContainer data={allAlbums} />
            </div>
        </div> 
    );
}

export default DashboardAlbums;
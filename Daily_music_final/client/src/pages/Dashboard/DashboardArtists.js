import React, { useEffect } from "react";

import { getAllArtists } from "../../api";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";
import ArtistContainer from "../../components/Container/ArtistContainer";

function DashboardArtists() {

    const [{ allArtists }, dispath] = useStateValue()

    useEffect(() => {
        if (!allArtists) {
            getAllArtists().then((data) => {
                dispath({
                    type : actionType.SET_ALL_ARTISTS,
                    allArtists : data.artist,
                })
            })
        }
    }, [])

    return ( 
        <div className="w-full p-4 flex items-center justify-center flex-col">
            <div className="relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md ">
                <ArtistContainer data={allArtists} />
            </div>
        </div> 
    );
}
export default DashboardArtists;
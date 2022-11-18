import React, { useEffect, useState } from "react";
import { BiCloudUpload } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { motion } from "framer-motion";

import FilterButtons from "../../components/Button/FilterButtons";
import { filterByLanguage, filters } from '../../utils/suportfuntions' 
import { useStateValue } from '../../context/StateProvider'
import { getAllAlbums, getAllArtists, getAllSongs, saveNewSong , saveNewArtist, saveNewAlbum} from "../../api";
import { actionType } from "../../context/reducer";
import { storage } from "../../config/firebase.config";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import DisabledButton from "../../components/Button/DisabledButton";

function DashboardNewSong() {

    const [songName, setSongName] = useState("")

    //song
    // song image
    const [songImageCover, setSongImageCover ] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(0)
    const [isImageLoading, setIsImageLoading] = useState(false)
    // song audio
    const [songAudioCover, setSongAudioCover ] = useState(null)
    const [audioUploadProgress, setAudioUploadProgress] = useState(0)
    const [isAudioLoading, setIsAudioLoading] = useState(false)

    //artist
    const [artistImageCover, setArtistImageCover ] = useState(null)
    const [artistImageUploadProgress, setArtistImageUploadProgress] = useState(0)
    const [isArtistUpLoading, setIsArtistUpLoading] = useState(false)
    const [artistName, setArtistName] = useState("")
    const [twitter, setTwitter] = useState("")
    const [instagram, setInstagram] = useState("")

    //album
    const [albumImageCover, setAlbumImageCover ] = useState(null)
    const [albumImageUploadProgress, setAlbumImageUploadProgress] = useState(0)
    const [isAlbumUpLoading, setIsAlbumUpLoading] = useState(false)
    const [albumName, setAlbumName] = useState("")


    const [{
        allArtists, 
        allAlbums, 
        allSongs, 
        artistFilter, 
        albumFilter, 
        filterTerm, 
        languageFilter, 
        alertType
    },dispath
    ] = useStateValue()

    // thanh nút category
    useEffect(() => {
        if(!allArtists) {
            getAllArtists().then((data) => {
                dispath({
                    type : actionType.SET_ALL_ARTISTS,
                    allArtists : data.artist
                })
            })
        }
        if(!allAlbums) {
            getAllAlbums().then((data) => {
                dispath({
                    type : actionType.SET_ALL_ALBUMS,
                    allAlbums : data.album
                })
            })
        }
    }, [])

    // delete hình ảnh
    const deleteFileObject = (url, isImages) => {
       if(isImages) {
        setIsImageLoading(true)
        setIsAudioLoading(true)
        setIsArtistUpLoading(true)
        setIsAlbumUpLoading(true)
       }
       const deleteRef = ref(storage, url)
       deleteObject(deleteRef).then(() => {
        setSongImageCover(null)
        setSongAudioCover(null)
        setArtistImageCover(null)
        setAlbumImageCover(null)
        setIsImageLoading(false)
        setIsAudioLoading(false)
        setIsArtistUpLoading(false)
        setIsAlbumUpLoading(false)
       })

        //hiển thị thông báo
        dispath({
            type : actionType.SET_ALERT_TYPE,
            alertType : "success"
        })

        setInterval(() => {
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : null
            })
        }, 5000)
    }

    // funtion save Song
    const saveSong = () => {
        if (!songImageCover || !songAudioCover) {

            //hiển thị thông báo
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : "danger"
            })

            setInterval(() => {
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : null
                })
            }, 5000)

        } else {
            setIsAudioLoading(true)
            setIsImageLoading(true)

            const data = {
                name: songName,
                imageURL: songImageCover,
                songURL: songAudioCover,
                album: albumFilter,
                artist: artistFilter,
                language: languageFilter,
                category: filterTerm,
            }

            saveNewSong(data).then((res) => {
                getAllSongs().then((songs) => {
                    dispath({
                        type: actionType.SET_ALL_SONGS,
                        allSongs: songs.songs,
                    })
                })
            })

            //hiển thị thông báo
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : "success"
            })

            setInterval(() => {
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : null
                })
            }, 5000)

            setSongName("")
            setIsAudioLoading(false)
            setIsImageLoading(false)
            setSongImageCover(null)
            setSongAudioCover(null)
            dispath({ type: actionType.SET_ARTISIT_FILTER, artistFilter: null })
            dispath({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null })
            dispath({ type: actionType.SET_ALBUM_FILTER, albumFilter: null })
            dispath({ type: actionType.SET_FILTER_TERM, filterTerm: null })
        }
    }

    // funtion save Artist
    const saveArtist = () => {
        if (!artistImageCover || !artistName || !twitter || !instagram) {
            
            //hiển thị thông báo
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : "danger"
            })

            setInterval(() => {
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : null
                })
            }, 5000)

        }else {
            setIsArtistUpLoading(true)

            const data = {
                name: artistName,
                imageURL: artistImageCover,
                twitter: `www.twitter.com/${twitter}`,
                instagram: `www.instagram.com/${instagram}`,
            }

            saveNewArtist(data).then((res) => {
                getAllArtists().then((data) => {
                    dispath({
                        type: actionType.SET_ALL_ARTISTS,
                        allArtists: data.artist,
                    })
                })
            })

            //hiển thị thông báo
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : "success"
            })

            setInterval(() => {
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : null
                })
            }, 5000)

            setIsArtistUpLoading(false)
            setArtistImageCover(null)
            setArtistName("")
            setTwitter("")
            setInstagram("")
        }
    }

    //funtion save Album
    const saveAlbum = () => {
        if (!albumImageCover || !albumName) {
            
            //hiển thị thông báo
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : "danger"
            })

            setInterval(() => {
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : null
                })
            }, 5000)

        } else {
            setIsAlbumUpLoading(true)

            const data = {
                name: albumName,
                imageURL: albumImageCover,
            }

            saveNewAlbum(data).then(() => {
                getAllAlbums().then((data) => {
                    dispath({
                        type : actionType.SET_ALL_ALBUMS,
                        allAlbums : data.album
                    })
                })
            })

            //hiển thị thông báo
            dispath({
                type : actionType.SET_ALERT_TYPE,
                alertType : "success"
            })

            setInterval(() => {
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : null
                })
            }, 5000)

            setIsAlbumUpLoading(false)
            setAlbumImageCover(null)
            setAlbumName("")
        }
    }

    return ( 
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 gap-4 rounded-md">

            {/* song name */}
            <input 
                className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
                type="text"
                placeholder="Type your song name..."
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
            />

            {/* nút list các category */}
            <div className="flex w-full justify-between flex-wrap items-center gap-4">
                <FilterButtons filterData = {allArtists} flag={"Artist"} />
                <FilterButtons filterData = {allAlbums} flag={"Albums"} />
                <FilterButtons filterData = {filterByLanguage} flag={"Language"} />
                <FilterButtons filterData = {filters} flag={"Category"} />
            </div>

            {/* image upload file */}
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isImageLoading && <FileLoader progress = {imageUploadProgress}/>}
                {!isImageLoading && (
                    <>
                        {!songImageCover ? (
                           <FileUploader 
                                updateState = {setSongImageCover}
                                setProgress = {setImageUploadProgress} 
                                isLoading = {setIsImageLoading}
                                isImage = {true}
                           />) : (
                                <div className="relative w-full h-full overflow-hidden rounded-md">
                                    <img
                                    src={songImageCover}
                                    className="w-full h-full object-cover"
                                    alt=""
                                    />

                                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(songImageCover, true)}>
                                        <MdDelete className="text-white" />
                                    </button>
                                </div>
                           )}
                    </>
                )}
            </div>

            {/* audio upload file */}
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isAudioLoading && <FileLoader progress = {audioUploadProgress}/>}
                {!isAudioLoading && (
                    <>
                        {!songAudioCover ? (
                           <FileUploader 
                                updateState = {setSongAudioCover}
                                setProgress = {setAudioUploadProgress} 
                                isLoading = {setIsAudioLoading}
                                isAudio = {false}
                           />) : (
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                                    <audio src={songAudioCover} controls></audio>

                                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(songAudioCover, false)}>
                                        <MdDelete className="text-white" />
                                    </button>
                                </div>
                           )}
                    </>
                )}
            </div>

            {/* button save Song */}
            <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isImageLoading || isAudioLoading ? (
                    <DisabledButton />
                ) : (
                    <motion.button 
                        className="px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg"
                        whileTap={{scale : 0.75}}
                        onClick={saveSong} 
                    >
                        Save song
                    </motion.button>
                )}
            </div>

            {/* upload artist */}
            <p className="text-xl font-semibold text-headingColor">Artist Details</p>
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isArtistUpLoading && <FileLoader progress = {artistImageUploadProgress}/>}
                {!isArtistUpLoading && (
                    <>
                        {!artistImageCover ? (
                           <FileUploader 
                                updateState = {setArtistImageCover}
                                setProgress = {setArtistImageUploadProgress} 
                                isLoading = {setIsArtistUpLoading}
                                isImage = {true}
                           />) : (
                                <div className="relative w-full h-full overflow-hidden rounded-md">
                                    <img
                                    src={artistImageCover}
                                    className="w-full h-full object-cover"
                                    alt=""
                                    />

                                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(artistImageCover, true)}>
                                        <MdDelete className="text-white" />
                                    </button>
                                </div>
                           )}
                    </>
                )}
            </div>

            {/* artist name */}
            <input 
                className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
                type="text"
                placeholder="Artist name..."
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
            />
            
            {/* Twitter */}
            <div className="flex items-center rounded-md p-3 shadow-md border border-gray-300 w-full">
                <p className="text-base font-semibold text-gray-400 ">www.twitter.com/</p>
                <input 
                    className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
                    type="text"
                    placeholder="your twiter id..."
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                />
            </div>

            {/* instagram */}
            <div className="flex items-center rounded-md p-3 shadow-md border border-gray-300 w-full">
                <p className="text-base font-semibold text-gray-400 ">www.twitter.com/</p>
                <input 
                    className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
                    type="text"
                    placeholder="your instagram id..."
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                />
            </div>
            
            {/* nút save Artist*/}
            <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isArtistUpLoading ? (
                    <DisabledButton />
                ) : (
                    <motion.button 
                        className="px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg"
                        whileTap={{scale : 0.75}}
                        onClick={saveArtist} 
                    >
                        Save Artist
                    </motion.button>
                )}
            </div>
            
            {/* upload album */}
            <p className="text-xl font-semibold text-headingColor">Album Details</p>
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isAlbumUpLoading && <FileLoader progress = {albumImageUploadProgress}/>}
                {!isAlbumUpLoading && (
                    <>
                        {!albumImageCover ? (
                           <FileUploader 
                                updateState = {setAlbumImageCover}
                                setProgress = {setAlbumImageUploadProgress} 
                                isLoading = {setIsAlbumUpLoading}
                                isImage = {true}
                           />) : (
                                <div className="relative w-full h-full overflow-hidden rounded-md">
                                    <img
                                    src={albumImageCover}
                                    className="w-full h-full object-cover"
                                    alt=""
                                    />

                                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(albumImageCover, true)}>
                                        <MdDelete className="text-white" />
                                    </button>
                                </div>
                           )}
                    </>
                )}
            </div>

            {/* album name */}
            <input 
                className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
                type="text"
                placeholder="Album name..."
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
            />

            {/* nút save Album */}
            <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isAlbumUpLoading ? (
                    <DisabledButton />
                ) : (
                    <motion.button 
                        className="px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg"
                        whileTap={{scale : 0.75}}
                        onClick={saveAlbum} 
                    >
                        Save Album
                    </motion.button>
                )}
            </div>
        </div>
     );
}
// chớp chớp loading
export const FileLoader = ({progress}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-textColor">
                {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
            </p>
            <div className="w-20 h-20 min-w-[40px] bg-red-600 animate-ping rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-red-600 blur-xl"></div>
            </div>
        </div>
    )
}

export const FileUploader = ({updateState, setProgress, isLoading, isImage}) => {

    const [{ alertType }, dispath] = useStateValue()

    const uploadFile = (e) => {
        isLoading(true)
        const uploadedFile = e.target.files[0]

        const storageRef = ref(
            storage,
            `${isImage ? "Images" : "Audio"}/${Date.now()}-${uploadedFile.name}`
        )

        const uploadTask = uploadBytesResumable(storageRef, uploadedFile)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgress((snapshot.bytesTransferred /snapshot.totalBytes) * 100)
            },
            (error) => {
                //hiển thị thông báo
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : "danger"
                })

                setInterval(() => {
                    dispath({
                        type : actionType.SET_ALERT_TYPE,
                        alertType : null
                    })
                }, 5000)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateState(downloadURL)
                    isLoading(false)
                })

                //hiển thị thông báo
                dispath({
                    type : actionType.SET_ALERT_TYPE,
                    alertType : "success"
                })

                setInterval(() => {
                    dispath({
                        type : actionType.SET_ALERT_TYPE,
                        alertType : null
                    })
                }, 5000)

            }
        )

    }

    return (
        <label>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col justify-center items-center cursor-pointer">
                    <p className="font-bold">
                        <BiCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload { isImage ? "an image" : "an audio"}</p>
                </div>
            </div>
            {/* để bấm vào khung hiện lên chọn file */}
            <input 
            type="file"
            name="upload-file"
            accept={`${isImage ? "image/*" : "audio/*"}`}
            className={"w-0 h-0"}
            onChange={uploadFile}
            />
        </label>
    )
}

export default DashboardNewSong;
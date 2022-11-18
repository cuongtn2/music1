 import React, { useEffect, useState } from 'react'
 import { Route, Routes, useNavigate} from 'react-router-dom'
import Login from '../src/components/Login'
import MusicPlayer from '../src/components/MusicPlayer'
import { app } from './config/firebase.config'

import { getAuth } from 'firebase/auth'

import {AnimatePresence, motion} from 'framer-motion' //thư viện dùng để r
import { validateUser } from './api'
import {useStateValue} from './context/StateProvider'
import { actionType } from './context/reducer'
import Home from './pages/Home'
import Trending from './pages/Trending'
import Favourites from './pages/Favourites'
import PlayList from './pages/PlayList'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard/Dashboard'
 
 function App () {

    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();
    
    //lấy tên đặt sẵn từ gg ra 
    const [{ user, isSongPlaying }, dispatch] = useStateValue();

    //bắt buộc người dùng đăng nhập mới vào trang đc 
    const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")

    //ko cho cho người dùng thay đổi link và xét giá trị xem đã có user chưa nếu chưa sẽ qua login còn rồi sẽ qua home và giữ như v 
    useEffect(() => {
        firebaseAuth.onAuthStateChanged((userCred) => {
            if(userCred) {
                userCred.getIdToken().then((token) => {
                    console.log(token)
                    validateUser(token).then((data) => {
                        dispatch({
                            type : actionType.SET_USER,
                            user : data,
                        })
                    })
                })
            }else {
                setAuth(false);
                window.localStorage.setItem("auth", "false");
                dispatch({
                    type : actionType.SET_USER,
                    user : null,
                })
                navigate("/login")
            }
        })
    }, [])

   return (
    <AnimatePresence exitBeforeEnter>
            {/* bộ định tuyến của trang muốn qua trang nào nhập dô trang đó  */}
            <Routes>
                <Route path='/login' element={<Login setAuth={setAuth}/>}/>
                <Route path='/*' element={<Home/>}/>
                <Route path='/trending' element={<Trending/>}/>
                <Route path='/favourites' element={<Favourites/>}/>
                <Route path='/dashboard/*' element={<Dashboard/>}/>
                <Route path='/playlist' element={<PlayList/>}/>
                <Route path='/upload' element={<Upload/>}/>
            </Routes>

            {isSongPlaying && (
                <motion.div
                    initial={{opacity : 0, y : 50}}
                    animate={{opacity : 1, y : 0}}
                    className={`fixed min-w-[700px] h-26 inset-x-0 bottom-0 bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
                >
                    <MusicPlayer/>
                </motion.div>
            )}
    </AnimatePresence>
   )
 }
 
 export default App
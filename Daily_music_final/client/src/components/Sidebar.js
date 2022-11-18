import React, { useState } from "react";
import { NavLink } from 'react-router-dom'

import { BsChevronDoubleRight } from "react-icons/bs"
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";

import images from '../assets/images'
import { useStateValue } from "../context/StateProvider";


function Sidebar() {

  const [{user}, dispatch] = useStateValue()

  const [open, setOpen] = useState(true)

  return ( 
    <div className={`${open ? "w-72" : "w-20"} p-5 pt-8 mt-0 duration-500 h-screen rounded-r-3xl bg-darkPurple relative`}>
      <div className={`absolute w-8 h-8 cursor-pointer -right-3 top-9 flex items-center justify-center border-2 border-darkPurple bg-white rounded-full ${open && 'rotate-180'}`}>
        <BsChevronDoubleRight onClick={() => setOpen(!open)}/>
      </div>
        <div className="flex gap-4 items-center">
          <img src={images.logo} alt="logo" className={`cursor-pointer rounded-2xl duration-500 ${!open && "rotate-[360deg]"}`}/>
          <h1 className={`text-white origin-left font-medium text-3xl duration-300 ${!open && "scale-0"}`}>Daily Music</h1>
        </div>
        <div className="pt-10">
            <NavLink to={"/"}
              className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>
              <img src={images.home} alt="home-icon" /> 
              <span className={`${!open && "hidden"} origin-left font-medium text-2xl duration-200`}>Home</span>
            </NavLink>
            <NavLink to={"/trending"}
              className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>
              <img src={images.treding} alt="home-icon" /> 
              <span className={`${!open && "hidden"} origin-left font-medium text-2xl duration-200`}>Trending</span>
            </NavLink>
            <NavLink to={"/favourites"}
              className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>
              <img src={images.favourites} alt="home-icon" /> 
              <span className={`${!open && "hidden"} origin-left font-medium text-2xl duration-200`}>Favourites</span>
            </NavLink>              
            <NavLink to={"/playlist"} 
              className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>
              <img src={images.playlist} alt="home-icon" /> 
              <span className={`${!open && "hidden"} origin-left font-medium text-2xl duration-200`}>Play List</span>
            </NavLink>              
        </div>
          
        <div className="pt-1 mt-4 border-t-4 rounded-lg">
        {/* chỉ định admin mới hiện dashboard */}
        {
          user?.user?.role ==="admin" && (
            <>
              <NavLink to={"/upload"}
                className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>
                <img src={images.upload} alt="home-icon" /> 
                <span className={`${!open && "hidden"} origin-left font-medium text-2xl duration-200`}>Upload</span>
              </NavLink>
              <NavLink to={"/dashboard/home"} 
                className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>
                <img src={images.dashboard} alt="home-icon" /> 
                <span className={`${!open && "hidden"} origin-left font-medium text-2xl duration-200`}>Dashboard</span>
              </NavLink>
            </>
          )
        }
        </div>
    </div>
  );
}

export default Sidebar;

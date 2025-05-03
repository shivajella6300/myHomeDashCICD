import { Button } from '@mui/material';
import React ,{useContext, useState}from 'react'

import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import {Collapse} from 'react-collapse';
import {MyContext}  from '../../App';
import { MdSpaceDashboard } from 'react-icons/md';
import { FiInbox, FiLogOut } from 'react-icons/fi';
import { HiOutlineUsers } from 'react-icons/hi';


const Sidebar = () => {
  const [submenuIndex,setSubmenuIndex]=useState(null);
  const isOpenSubMenu=(index)=>
  {
    if(submenuIndex===index)
    {
      setSubmenuIndex(null);
    }
    else
    {
      setSubmenuIndex(index);
    }
  }
  const context = useContext(MyContext);
  return (
    <div 
    onMouseEnter={() => context.setisSidebarOpen(true)}
    onMouseLeave={() => context.setisSidebarOpen(false)}
    className={`overflow-hidden sidebar fixed top-0 left-0 
      bg-gradient-to-b from-rose-500 to-rose-900 
      ${context.isSidebarOpen ? 'w-[16%]' : 'w-[90px]'} 
      h-full z-40 text-white py-2 px-4 border-r border-[rgba(255,255,255,0.1)] 
      transition-all duration-300`}>
  
      
      
    
  <div className='py-2 w-full flex justify-center'>
    <Link to="/">
      <img 
        src="https://ecme-react.themenate.net/img/logo/logo-light-full.png" 
        className={`transition-all duration-300 ${context.isSidebarOpen ? 'w-[120px]' : 'w-[40px]'}`} 
        alt="Logo"
      />
    </Link>
  </div>
  <ul className='mt-4 space-y-2 pt-[60px] pl-4'>


    <li>
      {/* Dashboard */}
<Link to="/dashboard">
  <Button className='w-full !capitalize !py-2 hover:!bg-[rgba(255,255,255,0.1)]
  !justify-start flex gap-3 text-[14px] !text-white !font-[700] items-center'>
    <MdSpaceDashboard className='text-[25px]' />
    {context.isSidebarOpen && <span>Dashboard</span>}
  </Button>
</Link>

{/* Inbox */}
<Link to="/StationaryList">
  <Button className='w-full !capitalize !py-2 hover:!bg-[rgba(255,255,255,0.1)]
  !justify-start flex gap-3 text-[14px] !text-white !font-[700] items-center'>
    <FiInbox className='text-[25px]' />
    {context.isSidebarOpen && <span>Inbox</span>}
  </Button>
</Link>

{/* Participants */}
<Link to="/participants">
  <Button className='w-full !capitalize !py-2 hover:!bg-[rgba(255,255,255,0.1)]
  !justify-start flex gap-3 text-[14px] !text-white !font-[700] items-center'>
    <HiOutlineUsers className='text-[25px]' />
    {context.isSidebarOpen && <span>Participants</span>}
  </Button>
</Link>
{/* Participants */}
{/* <Link to="/ManpowerUploadForm">
  <Button className='w-full !capitalize !py-2 hover:!bg-[rgba(255,255,255,0.1)]
  !justify-start flex gap-3 text-[14px] !text-white !font-[700] items-center'>
    <HiOutlineUsers className='text-[25px]' />
    {context.isSidebarOpen && <span>ManPower Upload</span>}
  </Button>
</Link> */}

{/* Log Out */}
<Link to="/logout">
  <Button className='w-full !capitalize !py-2 hover:!bg-[rgba(255,255,255,0.1)]
  !justify-start flex gap-3 text-[14px] !text-white !font-[700] items-center'>
    <FiLogOut className='text-[25px]' />
    {context.isSidebarOpen && <span>Log Out</span>}
  </Button>
</Link>

    </li>
  </ul>
</div>

  )
}

export default Sidebar;

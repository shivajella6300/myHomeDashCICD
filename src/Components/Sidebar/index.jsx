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

const Sidebar = () => {
  const [submenuIndex,setSubmenuIndex]=useState(null);
  const isOpenSubMenu=(index)=>
  {
    if(submenuIndex===index)
    {
      setSubmenuIndex(null);
    }else{
      setSubmenuIndex(index);
    }

  }
  const context = useContext(MyContext);
  return (
    <div className={`overflow-hidden sidebar fixed top-0 left-0 bg-[#fff] w-[${context.isSidebarOpen === true?'18%':'0px'}] 
         h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4`}>
          <div className='py-2 w-full'>
             <Link to="/">
                <img src="https://ecme-react.themenate.net/img/logo/logo-light-full.png" className='w-[120px]'/>
             </Link>
          </div>
          <ul className='mt-4'>
            <li>
              <Link to="/">
                  <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1]
                    !justify-start flex gap-3 text-[14px] 
                    !text-[rgba(0,0,0,0.8)] !font-[600] items-center'>
                      <RxDashboard className='text-[18px]'/><span>Dashboard</span>
                    </Button>
                </Link>
              </li>
              <li>
                <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1] 
                   !justify-start flex gap-3 text-[14px] 
                   !text-[rgba(0,0,0,0.8)] !font-[600] !items-center' onClick={()=>isOpenSubMenu(1)}>
                  <FaRegImage  className='text-[18px]'/><span>Home Slides</span>
                  <span className='ml-auto w-[30px] flex items-center justify-center'><FaAngleDown className={`transition-all ${submenuIndex===1? 'rotate-180':''}`}/>
                  </span>
              </Button>
              <Collapse isOpened={submenuIndex==1?true:false}>
                <ul className='w-full'>
                      <li className='w-full'>
                        <Link to="/HomeList">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Add Home Banner List
                          </Button>
                          </Link>
                      </li>
                      <li className='w-full'>
                        <Link to="/HomeList">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Add Home Banner List
                          </Button>
                        </Link>
                      </li>
                </ul>
              </Collapse>
              </li>
              <li>
                  <Link to="/users">
                      <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1] !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[600] items-center'>
                          <FiUsers className='text-[20px]'/><span>Users</span>
                      </Button>
                  </Link>
              </li>
              

              <li>
                <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1] 
                   !justify-start flex gap-3 text-[14px] 
                   !text-[rgba(0,0,0,0.8)] !font-[600] !items-center' onClick={()=>isOpenSubMenu(2)}>
                  <RiProductHuntLine  className='text-[18px]'/><span>Products</span>
                  <span className='ml-auto w-[30px] flex items-center justify-center'><FaAngleDown className={`transition-all ${submenuIndex===2? 'rotate-180':''}`}/>
                  </span>
              </Button>
              <Collapse isOpened={submenuIndex==2?true:false}>
                <ul className='w-full'>
                      <li className='w-full'>
                        <Link to="/products">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Product List
                          </Button>
                          </Link>
                      </li>
                      <li className='w-full'>
                        <Link to="/products/add">
                            <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                              <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Add Product
                            </Button>
                        </Link>
                      </li>
                </ul>
              </Collapse>
              </li>

              <li>
                <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1] 
                   !justify-start flex gap-3 text-[14px] 
                   !text-[rgba(0,0,0,0.8)] !font-[600] !items-center' onClick={()=>isOpenSubMenu(3)}>
                  <TbCategory  className='text-[18px]'/><span>Category</span>
                  <span className='ml-auto w-[30px] flex items-center justify-center'><FaAngleDown className={`transition-all ${submenuIndex===3? 'rotate-180':''}`}/>
                  </span>
              </Button>
              <Collapse isOpened={submenuIndex==3 ? true:false}>
                <ul className='w-full'>
                      <li className='w-full'>
                        <Link to="/categories">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Category List
                          </Button>
                          </Link>
                      </li>
                      <li className='w-full'>
                      <Link to="/categories/add">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Add Category
                          </Button>
                      </Link>
                      </li>
                      <li className='w-full'>
                      <Link to="/categories/sub">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Sub Category List
                          </Button>
                          </Link> 
                      </li>
                      <li className='w-full'>
                        <Link to="/categories/sub/add">
                          <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                            <span className='block w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.1)] flex gap-3'></span>Add Sub Category List
                          </Button>
                          </Link>
                      </li>
                </ul>
              </Collapse>
              </li>
              <li className='w-full'>
              <Link to="/orders">
                <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1]
                    !justify-start flex gap-3 text-[14px] 
                    !text-[rgba(0,0,0,0.8)] !font-[600] items-center'>
                   <IoBagCheckOutline  className='text-[20px]'/><span>Orders</span>
                   </Button>
                </Link>
              </li>
              <li className='w-full'>
              <Link to="/logout">
                <Button className='w-full !capitalize !py-2 hover:!bg-[#f1f1f1]
                        !justify-start flex gap-3 text-[14px] 
                        !text-[rgba(0,0,0,0.8)] !font-[600] items-center'>
                    <IoMdLogOut   className='text-[20px]'/><span>Log Out</span>
                </Button>
              </Link>
              </li>
          </ul>
    </div>
  )
}

export default Sidebar;

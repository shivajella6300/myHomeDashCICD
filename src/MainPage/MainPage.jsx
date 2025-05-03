import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiGlobe, FiPieChart } from "react-icons/fi"; // Intranet, LMS
import { FaUniversity, FaBullhorn, FaLaptopCode, FaUsers, FaGavel, FaBirthdayCake } from "react-icons/fa"; // JNAN, Marketing, IT, HR, Legal, Events
import { HiOfficeBuilding } from "react-icons/hi"; // SAP
import { RiHomeOfficeLine } from "react-icons/ri"; // Home Loans
import { MdWorkspaces, MdTravelExplore, MdOutlineEvent } from "react-icons/md"; // Myspace/Travel/Event
import { SiSap } from "react-icons/si"; // SAP Icon
import { FiMaximize } from "react-icons/fi";
import { FaCalendarCheck } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa"; // Make sure this import is at the top
import { FaCar } from "react-icons/fa";

const MainPage = () => {
  const navigate = useNavigate();
  const [userToken, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (userToken.token) {
      navigate('/dashboard');
    }
  }, [navigate, userToken.token]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
   
    <div
      className="grid grid-cols-12 gap-2 md:gap-4 p-2 md:p-4 min-h-screen"
      style={{
        backgroundImage: "url('https://i.pinimg.com/736x/b2/5c/63/b25c638ad797a8ff76f9c56f3b25403e.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Top Branding Section - Made responsive */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-6 z-10">
      <div className="h-12 w-12 md:h-16 lg:h-20 md:w-10 lg:w-20 rounded-full p-1 bg-white ml-2 sm:ml-4 md:ml-4 lg:ml-10"
      style={{
          animation: 'neonPulse 2.5s ease-in-out infinite',
          boxShadow: '0 0 4px rgb(193, 243, 226), inset 0 0 2px #00f0ff, 0 0 16px #00f0ff',
        }}>
          <img src="/myHomeDashboard/my home logo.png" alt="Logo" className="h-full w-full rounded-full object-cover border-2 border-#5F7161" />
        </div>
        <h1
  className="text-lg sm:text-base md:text-xl lg:text-lg xl:text-3xl text-center sm:text-left ml-4 font-bold"
  style={{ color: "#3C552D" }}
>
  MY HOME CONSTRUCTIONS PVT LTD
</h1>


        <div className="h-12 w-12 md:h-16 lg:h-20 md:w-16 lg:w-20 rounded-full p-1 bg-white hidden sm:block" style={{
          animation: 'neonPulse 2.5s ease-in-out infinite',
          boxShadow: '0 0 8px #00ffae, inset 0 0 4px #00ffae, 0 0 16px #00ffae',
        }}>
          <img src="/myHomeDashboard/chairman.png" alt="Chairman" className="h-full w-full rounded-full object-cover border-2 border-#5F7161"/>
        </div>
      </div>

      {/* Neon Keyframes */}
      <style>
  {`
    @keyframes neonPulse {
      0%, 100% {
        box-shadow: 0 0 12px #729762, inset 0 0 8px #729762, 0 0 26px #729762;
      }
      50% {
        box-shadow: 0 0 16px #729762, inset 0 0 8px #729762, 0 0 32px #729762;
      }
    }
  `}
</style>


     {/* App Links Section - Responsive Grid Layout */}
<div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 mt-24 md:mt-32 lg:mt-40 p-2">
  
 {/* INTRANET */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 rounded-xl border border-orange-300 shadow-[0_0_12px_2px_rgba(234,88,12,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-[#FCE7C8]"
    style={{ borderColor: "#FFB266" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FiGlobe className="text-4xl text-[#FF8364] -ml-8" /> {/* Negative margin */}

      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-orange-400"></div> {/* Increased line width */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        INTRANET
      </h3>

    </div>
  </div>
</Link>

{/* LMS */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 rounded-xl border border-green-300 shadow-[0_0_12px_2px_rgba(114,191,98,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#D4E7C5" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaCalendarCheck className="text-4xl text-green-600 ml-[-80px]" /> {/* Negative margin */}

      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-green-400"></div> {/* Increased line width */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold ml-[80px] text-center">
  LMS
</h3>


    </div>
  </div>
</Link>

{/* JNAN */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 rounded-xl border shadow-[0_0_12px_2px_rgba(188,159,139,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#DFD3C3", borderColor: "#D2B48C" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaBookOpen className="text-4xl text-[#5C4033] ml-[-80px]" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-[#D2B48C]"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        JNAN
      </h3>

    </div>
  </div>
</Link>

{/* SAP */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 rounded-xl border border-violet-300 shadow-[0_0_12px_2px_rgba(139,92,246,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#dcccf4", borderColor: "#C084FC" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <SiSap className="text-4xl  w-10 h-10 text-indigo-700 ml-[-80px]" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-indigo-500"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        SAP
      </h3>

    </div>
  </div>
</Link>

{/* HOME LOANS */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 rounded-xl border shadow-[0_0_12px_2px_rgba(244,63,94,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#FFCCCC", borderColor: "#F98080" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <RiHomeOfficeLine className="text-4xl text-rose-500 -ml-2" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-rose-400"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        HOME LOANS
      </h3>

    </div>
  </div>
</Link>

{/* LEGAL */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 bg-white rounded-xl border border-cyan-400 shadow-[0_0_12px_2px_rgba(6,182,212,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#BFECFF" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaGavel className="text-4xl text-cyan-500 ml-[-80px]" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-cyan-500"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        LEGAL
      </h3>

    </div>
  </div>
</Link>

{/* MARKETING */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 bg-white rounded-xl border border-pink-400 shadow-[0_0_12px_2px_rgba(219,39,119,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#F9A8D4" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaBullhorn className="text-4xl text-pink-600 -ml-2" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-pink-500"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        MARKETING
      </h3>

    </div>
  </div>
</Link>

{/* IT */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 bg-white rounded-xl border border-blue-300 shadow-[0_0_12px_2px_rgba(59,130,246,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#B3E1F9" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaLaptopCode className="text-4xl  w-10 text-blue-500 ml-[-100px]" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-blue-500"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        IT
      </h3>

    </div>
  </div>
</Link>

{/* HR */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 bg-white rounded-xl border border-rose-300 shadow-[0_0_12px_2px_rgba(251,113,133,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#e8c4cf" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaUsers className="text-4xl  w-10 text-rose-500 ml-[-90px]" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-rose-400"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        HR
      </h3>

    </div>
  </div>
</Link>

{/* TRAVEL GRID */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 bg-white rounded-xl border border-yellow-500 shadow-[0_0_12px_2px_rgba(234,179,8,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#FFDBAA" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaCar className="text-4xl text-yellow-700 -ml-2" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-yellow-700"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        TRAVEL GRID
      </h3>

    </div>
  </div>
</Link>

{/* MHCPL EVENTS */}
<Link to="/login">
  <div
    className="w-full max-w-[240px] mx-auto h-20 bg-white rounded-xl border border-violet-500 shadow-[0_0_12px_2px_rgba(139,92,246,0.7)] hover:scale-105 transition-transform duration-300 flex items-center justify-center"
    style={{ backgroundColor: "#C4B5FD" }}
  >
    {/* Flex container with Icon + Divider + Text */}
    <div className="flex items-center space-x-4">
      
      {/* Icon with margin-left adjustment */}
      <FaRegImages className="text-4xl text-violet-500 -ml-2" /> {/* Negative margin */}
      
      {/* Divider Line with increased width */}
      <div className="h-10 w-[4px] bg-violet-500"></div> {/* Increased line width with a matching color */}

      {/* Text */}
      <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
        MHCPL EVENTS
      </h3>

    </div>
  </div>
</Link>


      </div>

      {/* Right Content Column */}
      <div className="col-span-12 lg:col-span-5 mt-6 lg:mt-24 flex items-center justify-center  md:p-4" >
        {/* Container with Glow Line */}
        <div className="relative rounded-2xl glow-border-wrapper w-full max-w-md lg:max-w-full mt-[-100px] md:mt-[-100px] lg:mt-[-125px]" 
         style={{width: "1900px" }} >
          {/* Main Content Box */}
          <div className="relative  rounded-2xl p-3 md:p-4 space-y-4 md:space-y-8 h-[60vh] md:h-[70vh] lg:h-[99vh] overflow-y-auto z-10 
          shadow-xl border-1 border-black" style={{ backgroundColor: "#E1F0DA" }}
          >

            {/* Image Card */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base md:text-lg font-semibold">WARM WISHES ON YOUR SPECIAL DAY</h3>
                <button onClick={() => openModal('image')}
                   className="absolute top-0  right-0 p-2 text-gray-900 hover:text-black">
                  <FiMaximize />
                </button>
              </div>
              <img
                // src="./public/b9.jpg"
                src="https://s-media-cache-ak0.pinimg.com/originals/8d/ee/a1/8deea1684d2e774d2a4e691decb07334.gif"
                alt="Birthday"
                className="w-full mt-8 rounded-lg h-35 sm:h-38 md:h-60 lg:h-45 xl:h-80 object-cover"

              />
            </div>

            {/* Video Card */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base md:text-lg font-semibold">WATCH OUR SERVICES IN ACTION</h3>
                <button
    onClick={() => openModal('video')}
    className="absolute top-200 right-0 p-2 h-20 text-gray-900 hover:text-black"
  >
    <FiMaximize size={20} />
  </button>
              </div>
              <video
                src="/myHomeDashboard/v2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full mt-3 rounded-lg h-35 sm:h-78 md:h-64 lg:h-30 xl:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .glow-border-wrapper::before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 1.2rem;
            background: linear-gradient(90deg,rgb(247, 246, 248),rgb(231, 221, 70),rgb(236, 51, 174),#f6f6f6,rgb(28, 29, 29),rgb(47, 243, 178),rgb(96, 15, 236));
            background-size: 400% 400%;
            animation: borderGlide 2s linear infinite;
            z-index: 0;
            padding: 5px;
            filter: blur(6px);
            mask: 
              linear-gradient(#000 0 0) content-box, 
              linear-gradient(#000 0 0);
            mask-composite: exclude;
            -webkit-mask-composite: destination-out;
          }

          @keyframes borderGlide {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>

      {/* Modal View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeModal}
              className="absolute top-9 right-5 text-white text-3xl font-bold z-10"
            >
              &times;
            </button>
            {modalType === 'image' && (
              <img
                src="https://s-media-cache-ak0.pinimg.com/originals/8d/ee/a1/8deea1684d2e774d2a4e691decb07334.gif"
                alt="Fullscreen"
                className="w-full h-[50vh] md:h-[70vh] object-contain rounded-xl"
              />
            )}
            {modalType === 'video' && (
              <video
                src="./public/v2.mp4"
                autoPlay
                controls
                loop
                className="w-full h-[60vh] md:h-[80vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
